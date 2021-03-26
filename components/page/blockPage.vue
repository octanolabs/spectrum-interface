<template>
  <!--  TODO: add optional tab that lists uncles included in block-->
  <data-view
    :item="block"
    :active-tab="openTransactions ? 'transactions' : 'block'"
    :loading="loading"
  >
    <template v-slot:block.number.key>Height:</template>
    <template v-slot:block.number="{ number: height }">
      <nuxt-link
        :to="{
          name: 'block-id',
          params: { id: height - 1 },
        }"
      >
        <v-icon small>mdi-arrow-left-circle</v-icon>
      </nuxt-link>
      {{ height }}
      <nuxt-link
        v-if="fromHead > 0"
        :to="{
          name: 'block-id',
          params: { id: height + 1 },
        }"
        ><v-icon small>mdi-arrow-right-circle</v-icon></nuxt-link
      >
    </template>

    <template v-slot:block.timestamp="{ timestamp }">
      ~{{ calcTime(timestamp) }}
    </template>
    <template v-slot:block.transactions="{ transactions: txns }">
      <template v-if="txns !== 0"> {{ txns }} transactions </template>
      <template v-else>0 transactions</template>
    </template>
    <template v-slot:block.hash="{ hash }">
      {{ hash }}
    </template>
    <template v-slot:block.parentHash="{ parentHash }">
      <nuxt-link :to="{ name: 'block-id', params: { id: parentHash } }">{{
        parentHash
      }}</nuxt-link>
    </template>
    <template v-slot:block.sha3Uncles="{ sha3Uncles }">
      {{ sha3Uncles }}
    </template>
    <template v-slot:block.miner="{ miner }">
      <nuxt-link :to="{ name: 'address-account', params: { account: miner } }">
        {{ getAddressTag(miner) }}
      </nuxt-link>
    </template>
    <template v-slot:block.difficulty="{ difficulty }">
      {{ toTH(difficulty) }} TH
    </template>
    <template v-slot:block.size="{ size }">
      {{ formatNumber(size) }} bytes
    </template>
    <template v-slot:block.gasUsed="{ gasUsed, gasLimit }">
      {{ formatNumber(gasUsed) }} ({{ calcGasUsed(gasUsed, gasLimit) }})
    </template>
    <template v-slot:block.gasLimit="{ gasLimit }">
      {{ formatNumber(gasLimit) }}
    </template>
    <template v-slot:block.avgGasPrice="{ avgGasPrice }">
      {{ fromWeiToGwei(avgGasPrice) }} Gwei
    </template>
    <template v-slot:block.txFees="{ txFees }">
      {{ fromWei(txFees) }} UBQ
    </template>
    <template v-slot:block.blockReward="{ blockReward }">
      {{ fromWei(blockReward) }} UBQ
    </template>
    <template v-slot:block.uncleRewards="{ uncleRewards }">
      {{ fromWei(uncleRewards) }} UBQ
    </template>
    <template v-slot:block.nonce="{ nonce }">
      {{ nonce }}
    </template>
    <template v-slot:block.extraData="{ extraData }">
      {{ toUtf8(extraData) || toAscii(extraData) }} (hex:{{ extraData }})
    </template>
    <template v-slot:transactions>
      <txns-table
        v-if="transactions.length > 0"
        :transactions="transactions"
        :block-number="block.number"
        :total="transactions.length"
        block
        no-breadcrumbs
        no-loading
      />
      <p v-else>This block didn't mine any transactions</p>
    </template>
  </data-view>
</template>

<script>
import dataView from '~/components/util/DataView.vue'
import txnsTable from '~/components/tables/txnsTable.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  components: {
    dataView,
    txnsTable,
  },
  props: {
    latestBlock: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    block: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    transactions: {
      type: Array,
      required: true,
      default: () => [],
    },
    openTransactions: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    fromHead() {
      return this.latestBlock.number - this.block.number
    },
  },
  methods: {
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash
    },
    calcGasUsed(gasUsed, gasLimit) {
      return ((gasUsed / gasLimit) * 100).toFixed(2) + '%'
    },
    calcTime(timestamp) {
      return common.calcTime(timestamp)
    },
    toTH(diff) {
      return common.toTH(diff, 4)
    },
    formatNumber(val) {
      if (val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return null
      }
    },
    fromWei(val, roundTo) {
      return common.fromWei(val, roundTo)
    },
    fromWeiToGwei(val) {
      return common.fromWeiToGwei(val)
    },
    toAscii(val) {
      return common.toAscii(val)
    },
    toUtf8(val) {
      return common.toUtf8(val)
    },
  },
}
</script>
