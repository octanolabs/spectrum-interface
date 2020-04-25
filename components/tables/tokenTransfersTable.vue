<template>
  <table-view
    :items="transfers"
    :headers="headers"
    item-key="hash"
    :loading="loading"
    @refresh="$emit('refresh')"
  >
    <template v-slot:topMessage>
      Latest {{ formatNumber(transfers.length) }} token transfers from a total
      of {{ formatNumber(total) }}
    </template>
    <template v-slot:item.hash="{ value: txHash }">
      <nuxt-link :to="{ name: 'transaction-hash', params: { hash: txHash } }">
        {{ txHash.substring(0, 17) }}...
      </nuxt-link>
    </template>
    <template v-slot:item.timestamp="{ value: timestamp }">
      ~{{ calcTime(timestamp) }}
    </template>
    <template v-slot:item.from="{ value: fromAddress }">
      <!--      TODO: address route-->
      <span
        v-if="fromAddress === '0x0000000000000000000000000000000000000000'"
        style="color: #00ea90"
      >
        Newly minted Tokens
      </span>
      <nuxt-link
        v-else
        :to="{ name: 'Address', params: { hash: fromAddress } }"
      >
        {{ getAddressTag(fromAddress) }}
      </nuxt-link>
      <v-icon color="#333333">mdi-play</v-icon>
    </template>
    <template v-slot:item.to="{ value: toAddress }">
      <nuxt-link :to="{ name: 'Address', params: { hash: toAddress } }">
        {{ getAddressTag(toAddress) }}
      </nuxt-link>
    </template>
    <template v-slot:item.value="{ item: { value, contract } }">
      {{ formatValue(value, contract) }}
    </template>

    <template v-slot:item.contract="{ value: contractAddress }">
      {{ getName(contractAddress) }}
    </template>
  </table-view>
</template>

<script>
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'
import tokens from '~/scripts/tokens'
import TableView from '~/components/util/TableView'

export default {
  components: {
    TableView
  },
  props: {
    transfers: {
      type: Array,
      required: true,
      default: () => []
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    loading: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data: () => {
    return {
      currentPage: 1,
      perPage: 25,
      totalRows: 0,
      headers: [
        {
          value: 'hash',
          text: 'TxHash',
          sortable: false
        },
        {
          value: 'timestamp',
          text: 'Age',
          sortable: false
        },
        {
          value: 'from',
          text: 'From',
          sortable: false
        },
        {
          value: 'to',
          text: 'To',
          sortable: false
        },
        {
          value: 'value',
          text: 'Value',
          sortable: false
        },
        {
          value: 'contract',
          text: 'Token',
          sortable: false
        }
      ]
    }
  },
  methods: {
    getRowCount(items) {
      return items.length
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash.substring(0, 17) + '...'
    },
    calcTime(timestamp) {
      return this.$moment().to(timestamp * 1000)
    },
    formatValue(val, contract) {
      return tokens.formatValue(val, contract)
    },
    getName(contract) {
      return tokens.getName(contract)
    },
    formatNumber(val) {
      return common.formatNumber(val)
    }
  }
}
</script>
