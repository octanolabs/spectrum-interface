<template>
  <table-view
    :items="blocks"
    :headers="headers"
    :loading="loading"
    item-key="number"
    v-bind="$attrs"
    @refresh="$emit('refresh')"
  >
    <template v-slot:topMessage>
      Showing {{ formatNumber(blocks.length) }} blocks from a total
      {{ formatNumber(total) }} blocks
    </template>
    <template v-slot:item.timestamp="data">
      {{ $moment.unix(data.value).format('L, LTS') }}
    </template>
    <template v-slot:item.number="data">
      <nuxt-link :to="{ name: 'block-id', params: { id: data.value } }">{{
        data.value
      }}</nuxt-link>
    </template>
    <template v-slot:item.transactions="data">
      <template v-if="data.value !== 0">
        <nuxt-link :to="`/block/${data.item.number}/transactions`">
          {{ data.value }}
        </nuxt-link>
      </template>
      <template v-else>
        <span>{{ data.value }}</span>
      </template>
    </template>
    <template v-slot:item.hash="data">
      <nuxt-link :to="{ name: 'block-id', params: { id: data.value } }">
        {{ data.value }}
      </nuxt-link>
    </template>
    <template v-slot:item.miner="data">
      <nuxt-link
        :to="{ name: 'account-address', params: { address: data.value } }"
      >
        {{ getAddressTag(data.value) }}
      </nuxt-link>
    </template>
    <template v-slot:item.gasUsed="data">
      {{ data.value }} ({{ calcGasUsed(data.value, data.item.gasLimit) }})
    </template>
    <template v-slot:item.avgGasPrice="data">
      <span v-if="data.value !== 'NaN'">
        {{ fromWeiToGwei(data.value) }} gwei
      </span>
      <span v-else>-</span>
    </template>
    <template v-slot:item.blockReward="data">
      {{ fromWei(addTxFees(data.value, data.item.txFees)) }} UBQ
    </template>
  </table-view>
</template>

<script>
import tableView from '~/components/util/TableView.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  name: 'BlocksTable',
  components: {
    tableView,
  },
  props: {
    blocks: {
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
  },
  data() {
    return {
      headers: [
        {
          text: 'Timestamp',
          value: 'timestamp',
          sortable: false,
        },
        {
          text: 'Height',
          value: 'number',
          sortable: false,
        },
        {
          text: 'Txns',
          value: 'transactions',
          sortable: false,
        },
        {
          text: 'Uncles',
          value: 'uncles',
          sortable: false,
        },
        {
          text: 'BlockHash',
          value: 'hash',
          sortable: false,
        },
        {
          text: 'Miner',
          value: 'miner',
          sortable: false,
        },
        {
          text: 'GasUsed',
          value: 'gasUsed',
          sortable: false,
        },
        {
          text: 'GasLimit',
          value: 'gasLimit',
          sortable: false,
        },
        {
          text: 'Avg.GasPrice',
          value: 'avgGasPrice',
          sortable: false,
        },
        {
          text: 'Reward',
          value: 'blockReward',
          sortable: false,
        },
      ],
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
    addTxFees(reward, txFees) {
      return common.addTxFees(reward, txFees)
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash.substring(0, 17) + '...'
    },
    calcGasUsed(gasUsed, gasLimit) {
      return ((gasUsed / gasLimit) * 100).toFixed(2) + '%'
    },
    calcTime(timestamp) {
      return common.calcTime(timestamp)
    },
    formatNumber(val) {
      return common.formatNumber(val)
    },
  },
}
</script>
