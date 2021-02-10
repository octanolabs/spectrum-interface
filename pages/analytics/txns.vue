<template>
  <v-col cols="12">
    <txns-chart
      v-if="store.txns"
      :txns="store.txns.data"
      :avg-gas-price="store.gasPrice.data"
      :tx-fees="store.txFees.data"
      :prices="store.txFees.prices"
    />
  </v-col>
</template>

<script>
import TxnsChart from '../../components/charts/TxnsChart'

export default {
  components: { TxnsChart },
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
