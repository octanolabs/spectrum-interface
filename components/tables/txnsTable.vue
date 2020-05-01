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
      <span v-else> a total of {{ total }} </span>
    </template>
    <template v-else v-slot:topMessage>
      Showing {{ formatNumber(transactions.length) }} pending transactions
    </template>
    <template v-if="!pending" v-slot:item.hash="{ value: txHash }">
      <nuxt-link :to="{ name: 'transaction-hash', params: { hash: txHash } }">
        {{ txHash.substring(0, 23) }}...
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
    <template v-slot:item.to="{ value: receiver }">
      <v-icon color="#333333">mdi-play</v-icon>
      <nuxt-link
        :to="{ name: 'account-address', params: { address: receiver } }"
      >
        {{ getAddressTag(receiver) }}
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
      {{ fromWeiToGwei(hexToDecimal(gasPrice)) }} Gwei
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
    tableView
  },
  props: {
    transactions: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    total: {
      type: Number,
      required: true,
      default: () => {
        return false
      }
    },
    loading: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      }
    },
    pending: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      }
    },
    block: {
      type: Boolean,
      required: false,
      default: false
    },
    blockNumber: {
      type: Number,
      required: false,
      default: () => {
        return 0
      }
    }
  },
  computed: {
    headers() {
      let headers = [
        {
          text: 'Txhash',
          value: 'hash',
          sortable: false
        },
        {
          text: 'From',
          value: 'from',
          sortable: false
        },
        {
          text: 'To',
          value: 'to',
          sortable: false
        },
        {
          text: 'Value',
          value: 'value',
          sortable: false
        }
      ]

      if (this.pending) {
        headers = [
          ...headers,
          {
            text: 'Gas Price',
            value: 'gasPrice',
            sortable: false
          }
        ]
      } else {
        headers = [
          ...headers,
          {
            text: 'Txfee',
            value: 'txFee',
            sortable: false
          }
        ]
      }

      return headers
    }
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
      return addresses.getAddressTag(hash) || hash.substring(0, 23) + '...'
    },
    calcTxFee(gasUsed, gasPrice) {
      return common.fromWei(common.calcTxFee(gasUsed, gasPrice))
    },
    formatNumber(val) {
      return common.formatNumber(val)
    },
    hexToDecimal(hex) {
      return common.hexToDecimal(hex)
    }
  }
}
</script>
