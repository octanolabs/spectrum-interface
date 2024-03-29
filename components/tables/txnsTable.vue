<template>
  <table-view
    :items="transactions"
    :headers="headers"
    :loading="loading"
    item-key="hash"
    v-bind="$attrs"
    @refresh="$emit('refresh')"
  >
    <template v-if="!pending" v-slot:topMessage>
      Showing ({{ formatNumber(transactions.length) }}) transactions from
      <span v-if="block" class="font-weight-light">
        block {{ blockNumber }}
      </span>
      <span v-else> a total of {{ formatNumber(total) }} </span>
    </template>
    <template v-else v-slot:topMessage>
      Showing {{ formatNumber(transactions.length) }} pending transactions
    </template>
    <template v-if="!pending" v-slot:item.timestamp="{ value: ts }">
      {{ calcTime(ts) }}
    </template>
    <template v-slot:item.hash="{ value: txHash }">
      <nuxt-link :to="{ name: 'tx-hash', params: { hash: txHash } }">
        {{ formatHash(txHash) }}
      </nuxt-link>
    </template>
    <template v-slot:item.from="{ value: sender }">
      <nuxt-link :to="{ name: 'address-account', params: { account: sender } }">
        {{ getAddressTag(sender) }}
      </nuxt-link>
    </template>
    <template v-if="!deploysContracts" v-slot:item.to="{ value: receiver }">
      <v-icon color="#333333">mdi-play</v-icon>
      <nuxt-link
        :to="{ name: 'address-account', params: { account: receiver } }"
      >
        {{ getAddressTag(receiver) }}
      </nuxt-link>
    </template>
    <template v-if="deploysContracts" v-slot:header.contractAddress>
      <v-icon color="#333333">mdi-script</v-icon>
      Contract
    </template>
    <template
      v-if="deploysContracts"
      v-slot:item.contractAddress="{ value: contractAddress }"
    >
      <nuxt-link
        :to="{ name: 'address-account', params: { account: contractAddress } }"
      >
        {{ getAddressTag(contractAddress) }}
      </nuxt-link>
    </template>
    <template v-slot:item.value="{ value: amount }">
      {{ fromWei(amount) }} UBQ
    </template>
    <template
      v-if="!pending"
      v-slot:item.txFee="{ item: { gasUsed, gasPrice } }"
    >
      {{ calcTxFee(gasUsed, gasPrice) }}
    </template>
    <template v-else v-slot:item.gasPrice="{ item: { gasPrice } }">
      {{ fromWeiToGwei(gasPrice) }} Gwei
    </template>
    <template v-slot:item.status="{ item }">
      <v-tooltip v-if="item.status" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon small color="primary" v-bind="attrs" v-on="on">
            mdi-check-circle
          </v-icon>
        </template>
        <span>Success.</span>
      </v-tooltip>
      <v-tooltip v-else-if="!isByzantium(item.blockNumber)" bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon small v-bind="attrs" v-on="on">mdi-information</v-icon>
        </template>
        <span>
          This transaction predates the activation of Andromeda. Status is
          unavailble.
        </span>
      </v-tooltip>
      <v-tooltip v-else bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon small color="secondary" v-bind="attrs" v-on="on">
            mdi-alert-circle
          </v-icon>
        </template>
        <span>Failed to execute.</span>
      </v-tooltip>
    </template>
  </table-view>
</template>

<script>
import { getPersona } from '@octano/persona'
import tableView from '../util/TableView.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'
import config from '~/params/config.json'

export default {
  name: 'TxnsTable',
  components: {
    tableView,
  },
  props: {
    transactions: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    total: {
      type: Number,
      required: true,
      default: () => {
        return false
      },
    },
    loading: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      },
    },
    pending: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      },
    },
    block: {
      type: Boolean,
      required: false,
      default: false,
    },
    deploysContracts: {
      type: Boolean,
      required: false,
      default: false,
    },
    blockNumber: {
      type: Number,
      required: false,
      default: () => {
        return 0
      },
    },
  },
  computed: {
    headers() {
      let defaultHeaders = [
        {
          text: 'Timestamp',
          value: 'timestamp',
          sortable: false,
        },
        {
          text: 'Txhash',
          value: 'hash',
          sortable: false,
        },
        {
          text: 'From',
          value: 'from',
          sortable: false,
        },
      ]

      if (this.deploysContracts) {
        defaultHeaders = [
          ...defaultHeaders,
          {
            text: 'Contract',
            value: 'contractAddress',
            sortable: false,
          },
          {
            text: 'Value',
            value: 'value',
            sortable: false,
          },
        ]
      } else {
        defaultHeaders = [
          ...defaultHeaders,
          {
            text: 'To',
            value: 'to',
            sortable: false,
          },
          {
            text: 'Value',
            value: 'value',
            sortable: false,
          },
        ]
      }

      if (this.pending) {
        const [, ...headers] = defaultHeaders
        defaultHeaders = [
          ...headers,
          {
            text: 'Gas Price',
            value: 'gasPrice',
            sortable: false,
          },
        ]
      } else {
        defaultHeaders = [
          ...defaultHeaders,
          {
            text: 'Txfee',
            value: 'txFee',
            sortable: false,
          },
          {
            text: '',
            value: 'status',
            sortable: false,
          },
        ]
      }

      return defaultHeaders
    },
  },
  methods: {
    isByzantium(blockNumber) {
      return blockNumber >= config.byzantium
    },
    getRowCount(items) {
      return items.length
    },
    fromWei(value) {
      return common.fromWei(value)
    },
    fromWeiToGwei(value) {
      return common.fromWeiToGwei(value)
    },
    getAddressTag(hash) {
      if (hash) {
        const tag = addresses.getAddressTag(hash)
        if (tag) {
          return tag
        }

        const persona = getPersona(hash)
        if (persona.success) {
          return persona.name.given + ' ' + persona.name.family
        }

        const checksum = common.toChecksumAddress(hash)
        return (
          checksum.substr(0, 8) + '...' + checksum.substr(checksum.length - 6)
        )
      }
      return hash
    },
    calcTxFee(gasUsed, gasPrice) {
      return common.fromWei(common.calcTxFee(gasUsed, gasPrice))
    },
    formatNumber(val) {
      return common.formatNumber(val)
    },
    hexToDecimal(hex) {
      return common.hexToDecimal(hex)
    },
    calcTime(timestamp) {
      return this.$moment().to(timestamp * 1000)
    },
    formatHash(hash) {
      return hash.substr(0, 10) + '...' + hash.substr(hash.length - 8)
    },
  },
}
</script>
