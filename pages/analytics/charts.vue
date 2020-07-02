<template>
  <v-row justify="center">
    <v-col cols="10">
      <chart-display :loading="$fetchState.pending">
        <template v-slot:transactions>
          <txns-chart
            :txns="store.txns.data"
            :avg-gas-price="store.gasPrice.data"
            :tx-fees="store.txFees.data"
            :prices="store.txFees.prices"
          />
        </template>
        <template v-slot:blocks>
          <blocks-chart
            :blocks="store.blocks.data"
            :supply="store.supply.data"
            :block-time="store.blockTime.data"
            :difficulty="store.difficulty.data"
          />
        </template>
        <template v-slot:Gas>
          <gas-chart
            :gas-limit="store.gasLimit.data"
            :gas-used="store.gasUsed.data"
            :gas-price-levels="store.gasPriceLevels.data"
            :gas-used-levels="store.gasUsedLevels.data"
            :gas-levels="store.gasLevels.data"
          />
        </template>
      </chart-display>
    </v-col>
  </v-row>
</template>

<script>
import TxnsChart from '../../components/charts/TxnsChart'
import BlocksChart from '../../components/charts/BlocksChart'
import GasChart from '../../components/charts/GasChart'
import ChartDisplay from '~/components/util/charts/ChartDisplay'

export default {
  components: { GasChart, BlocksChart, TxnsChart, ChartDisplay },
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
