<template>
  <data-view :item="uncle">
    <template v-slot:uncle.blockNumber.key="{ blockNumber }">
      Included in block
      <nuxt-link :to="{ name: 'block-id', params: { id: blockNumber } }">
        {{ blockNumber }}
      </nuxt-link>
    </template>
    <template v-slot:uncle.number.key>Uncle Height:</template>
    <template v-slot:uncle.number="{ number }">
      {{ number }}
    </template>
    <template v-slot:uncle.position="{ position }">
      {{ position }}
    </template>
    <template v-slot:uncle.hash="{ hash }">
      {{ hash }}
    </template>
    <template v-slot:uncle.parentHash="{ parentHash }">
      {{ parentHash }}
    </template>
    <template v-slot:uncle.sha3Uncles="{ sha3Uncles }">
      {{ sha3Uncles }}
    </template>
    <template v-slot:uncle.miner.key>Mined by:</template>
    <template v-slot:uncle.miner="{ miner }">
      <nuxt-link :to="{ name: 'address-account', params: { hash: miner } }">
        {{ getAddressTag(miner) }}
      </nuxt-link>
    </template>
    <template v-slot:uncle.difficulty="{ difficulty }">
      {{ difficulty }}
    </template>
    <template v-slot:uncle.gasUsed="{ gasUsed, gasLimit }">
      {{ nf.format(uncle.gasUsed) }} ({{ calcGasUsed(gasUsed, gasLimit) }})
    </template>
    <template v-slot:uncle.gasLimit="{ gasLimit }">
      {{ nf.format(gasLimit) }}
    </template>
    <template v-slot:uncle.timestamp="{ timestamp }">
      ~{{ calcTime(timestamp) }}
    </template>
    <template v-slot:uncle.reward="{ reward }">
      {{ fromWei(reward) }} UBQ
    </template>
  </data-view>
</template>

<script>
import dataView from '~/components/util/DataView.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  components: {
    dataView,
  },
  props: {
    uncle: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      nf: new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 18,
      }),
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
      return (
        this.$moment().to(timestamp * 1000) +
        ' (' +
        this.$moment.utc(timestamp * 1000).format('lll') +
        ' UTC)'
      )
    },
    fromWei(val, roundTo) {
      return common.fromWei(val, roundTo)
    },
  },
}
</script>
