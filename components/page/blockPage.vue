<template>
  <data-view :item="block">
    <template v-slot:block.number.key>
      Height:
    </template>
    <template v-slot:block.number="{ number: height }">
      <nuxt-link
        :to="{
          name: 'block-id',
          params: { id: height - 1 }
        }"
      >
        <v-icon small>mdi-arrow-left-circle</v-icon>
      </nuxt-link>
      {{ height }}
      <nuxt-link
        v-if="fromHead > 0"
        :to="{
          name: 'block-id',
          params: { id: height + 1 }
        }"
        ><v-icon small>mdi-arrow-right-circle</v-icon></nuxt-link
      >
    </template>

    <template v-slot:block.timestamp="{ timestamp }">
      ~{{ calcTime(timestamp) }}
    </template>
    <template v-slot:block.transactions="{ number: height, transactions }">
      <template v-if="transactions !== 0">
        <nuxt-link
          :to="{
            name: 'block-id-action',
            params: {
              id: height,
              action: 'transactions'
            }
          }"
        >
          {{ transactions }} transactions
        </nuxt-link>
      </template>
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
      {{ getAddressTag(miner) }}
    </template>
    <template v-slot:block.difficulty="{ difficulty }">
      {{ toTH(difficulty) }} TH
    </template>
    <template v-slot:block.size="{ size }">
      {{ formatNumber(size) }}
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
  </data-view>
</template>

<script>
import dataView from '~/components/util/DataView.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  components: {
    dataView
  },
  props: {
    latestBlock: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    block: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      refreshing: false,
      isBlock: false
    }
  },
  computed: {
    fromHead() {
      return this.latestBlock.number - this.block.number
    }
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
    fromWei(val) {
      return common.fromWei(val)
    },
    fromWeiToGwei(val) {
      return common.fromWeiToGwei(val)
    },
    toAscii(val) {
      return common.toAscii(val)
    },
    toUtf8(val) {
      return common.toUtf8(val)
    }
  }
}
</script>
