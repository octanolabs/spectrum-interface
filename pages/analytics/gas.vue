<template>
  <v-col v-if="store.gasLimit.data" cols="12">
    <gas-chart
      :gas-limit="store.gasLimit.data"
      :gas-used="store.gasUsed.data"
      :gas-price-levels="store.gasPriceLevels.data"
      :gas-used-levels="store.gasUsedLevels.data"
      :gas-levels="store.gasLevels.data"
      :avg-gas-price="store.gasPrice.data"
    />
  </v-col>
</template>

<script>
import GasChart from '../../components/charts/GasChart'

export default {
  components: { GasChart },
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
