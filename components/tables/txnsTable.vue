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
    <template v-if="!pending" v-slot:item.hash="{ value: txHash }">
      <nuxt-link :to="{ name: 'transaction-hash', params: { hash: txHash } }">
        {{ formatHash(txHash) }}
      </nuxt-link>
    </template>
    <template v-else v-slot:item.hash="{ value: txHash }">
      {{ txHash }}
    </template>
    <template v-slot:item.from="{ value: sender }">
      <nuxt-link :to="{ name: 'account-address', params: { address: sender } }">
        {{ getAddressTag(sender) }}
      </nuxt-link>
    </template>
    <template v-if="!deploysContracts" v-slot:item.to="{ value: receiver }">
      <v-icon color="#333333">mdi-play</v-icon>
      <nuxt-link
        :to="{ name: 'account-address', params: { address: receiver } }"
      >
        {{ getAddressTag(receiver) }}
      </nuxt-link>
    </template>
    <template v-if="deploysContracts" v-slot:header.contractAddress>
      <v-icon color="#333333">mdi-script</v-icon>
      Contract Address
    </template>
    <template
      v-if="deploysContracts"
      v-slot:item.contractAddress="{ value: contractAddress }"
    >
      <nuxt-link
        :to="{ name: 'account-address', params: { address: contractAddress } }"
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
    <template v-slot:item.status="{ value: status }">
      <v-icon v-if="status" color="success">mdi-check-circle</v-icon>
      <v-icon v-else color="error">mdi-alert-circle</v-icon>
    </template>
  </table-view>
</template>

<script>
import tableView from '../util/TableView.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

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
            text: 'Contract Address',
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
      const checksum = common.toChecksumAddress(hash)
      return (
        addresses.getAddressTag(hash) ||
        checksum.substr(0, 8) + '...' + checksum.substr(hash.length - 6)
      )
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
