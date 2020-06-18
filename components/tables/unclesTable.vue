<template>
  <table-view
    :items="uncles"
    :headers="headers"
    :loading="loading"
    item-key="hash"
    v-bind="$attrs"
    @refresh="$emit('refresh')"
  >
    <template v-slot:topMessage>
      Showing {{ formatNumber(uncles.length) }} uncles from a total
      {{ formatNumber(total) }} uncles
    </template>
    <template v-slot:item.timestamp="{ value: timestamp }">
      {{ calcTime(timestamp) }}
    </template>
    <template v-slot:item.blockNumber="{ value: blockNumber }">
      <nuxt-link :to="{ name: 'block-id', params: { id: blockNumber } }">
        {{ blockNumber }}
      </nuxt-link>
    </template>
    <template v-slot:item.number="{ value: number, item: { hash } }">
      <nuxt-link :to="{ name: 'uncle-hash', params: { hash: hash } }">{{
        number
      }}</nuxt-link>
    </template>
    <template v-slot:item.hash="{ item: { hash } }">
      <nuxt-link :to="{ name: 'uncle-hash', params: { hash: hash } }">{{
        hash
      }}</nuxt-link>
    </template>
    <template v-slot:item.miner="{ value: miner }">
      <nuxt-link :to="{ name: 'account-address', params: { address: miner } }">
        {{ getAddressTag(miner) }}
      </nuxt-link>
    </template>
    <template v-slot:item.reward="{ value: reward }">
      {{ fromWei(reward) }} UBQ
    </template>
  </table-view>
</template>

<script>
import tableView from '~/components/util/TableView.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  name: 'UnclesTable',
  components: {
    tableView,
  },
  props: {
    uncles: {
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
        { text: 'Block Height', value: 'blockNumber' },

        { text: 'Uncle Number', value: 'number' },

        { text: 'Uncle Hash', value: 'hash' },

        { text: 'Age', value: 'timestamp' },

        { text: 'Miner', value: 'miner' },

        { ext: 'Reward', value: 'reward' },
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
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash.substring(0, 17) + '...'
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
