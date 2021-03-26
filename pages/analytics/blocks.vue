<template>
  <v-col cols="12">
    <blocks-chart
      :blocks="store.blocks.data"
      :supply="store.supply.data"
      :block-time="store.blockTime.data"
      :difficulty="store.difficulty.data"
    />
  </v-col>
</template>

<script>
import BlocksChart from '../../components/charts/BlocksChart'

export default {
  components: { BlocksChart },
  async fetch() {
    await this.$store.dispatch('charts/fetchAll')
  },
  computed: {
    store() {
      return this.$store.state.charts
    },
  },
}
</script>
