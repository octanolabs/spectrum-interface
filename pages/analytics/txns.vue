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
  async middleware({ store }) {
    await store.dispatch('charts/fetchTransactions')
    await store.dispatch('charts/fetchAll')
    await store.dispatch('fetchStats')
    await store.dispatch('fetchChainSummary')
  },
  computed: {
    store() {
      return this.$store.state.charts
    },
  },
}
</script>
