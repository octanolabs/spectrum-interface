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
      {{ calcTime(data.value) }}
    </template>
    <template v-slot:item.number="data">
      <nuxt-link :to="{ name: 'block-id', params: { id: data.value } }">{{
        data.value
      }}</nuxt-link>
    </template>
    <template v-slot:item.transactions="data">
      <template v-if="data.value.length !== 0">
        <nuxt-link :to="`/block/${data.item.number}?tab=transactions`">
          {{ data.value.length }}
        </nuxt-link>
      </template>
      <template v-else>
        <span>{{ data.value.length }}</span>
      </template>
    </template>
    <template v-slot:item.hash="data">
      <nuxt-link :to="{ name: 'block-id', params: { id: data.value } }">
        {{ data.value }}
      </nuxt-link>
    </template>
    <template v-slot:item.miner="data">
      <nuxt-link
        :to="{ name: 'address-account', params: { account: data.value } }"
      >
        {{ getAddressTag(data.value) }}
      </nuxt-link>
    </template>
    <template v-slot:item.gasUsed="data">
      {{ data.value }}/{{ data.item.gasLimit }} ({{
        calcGasUsed(data.value, data.item.gasLimit)
      }})
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
import { getPersona } from '@octano/persona'
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
          text: 'Height',
          value: 'number',
          sortable: false,
        },
        {
          text: 'Timestamp',
          value: 'timestamp',
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
          text: 'Miner',
          value: 'miner',
          sortable: false,
        },
        {
          text: 'Gas Used/Gas Limit',
          value: 'gasUsed',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Avg.GasPrice',
          value: 'avgGasPrice',
          align: 'right',
          sortable: false,
        },
        {
          text: 'Reward',
          value: 'blockReward',
          align: 'right',
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
      const tag = addresses.getAddressTag(hash)
      if (tag) {
        return tag
      }

      const persona = getPersona(hash)
      return persona.name.given + ' ' + persona.name.family
    },
    calcGasUsed(gasUsed, gasLimit) {
      return ((gasUsed / gasLimit) * 100).toFixed(2) + '%'
    },
    calcTime(timestamp) {
      return this.$moment().to(timestamp * 1000)
    },
    formatNumber(val) {
      return common.formatNumber(val)
    },
  },
}
</script>
