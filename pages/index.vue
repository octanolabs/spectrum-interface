<template>
  <v-container fluid class="pa-0">
    <v-col cols="12" class="pa-0">
      <v-card tile class="pa-2 border-bottom">
        <v-row no-gutters>
          <v-col cols="12" md="8" sm="12" xs="12">
            <v-row no-gutters>
              <v-col cols="12" md="6" sm="6" xs="12">
                <v-list dense>
                  <v-list-item class="border-right">
                    <v-list-item-avatar>
                      <v-icon>mdi-cash</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>UBQ PRICE</v-list-item-title>
                      <v-list-item-subtitle>
                        ${{ prices.ubq.usd.toFixed(3) }} @
                        {{ prices.ubq.btc }} BTC/UBQ
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item class="border-right">
                    <v-list-item-avatar>
                      <v-icon>mdi-cash-multiple</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>MARKET CAP</v-list-item-title>
                      <v-list-item-subtitle>
                        ${{
                          calcMarketcap(
                            fromWei(stats.supply / 1000000, -1),
                            prices.ubq.usd
                          )
                        }}
                        MILLION
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item class="border-right">
                    <v-list-item-avatar>
                      <v-icon>mdi-bank-transfer</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>TRANSACTIONS</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ number.format(summary.txnCount) }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col cols="12" md="6" sm="6" xs="12">
                <v-list dense>
                  <v-list-item class="border-right">
                    <v-list-item-avatar>
                      <v-icon>mdi-cube-scan</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>BLOCK HEIGHT</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ number.format(latestBlock) }} ({{
                          summary.blocktime
                        }}s)
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item class="border-right">
                    <v-list-item-avatar>
                      <v-icon>mdi-pickaxe</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>Difficulty</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ summary.difficulty }} TH
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item class="border-right">
                    <v-list-item-avatar>
                      <v-icon>mdi-gauge-full</v-icon>
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>HASHRATE</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ summary.hashrate }} GH/s
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="4" sm="12" xs="12">
            <chart-wrapper
              light-toolbar
              :series="chartData"
              :options="chartOptions"
            />
          </v-col>
        </v-row>
      </v-card>
      <v-row no-gutters class="elevation-0">
        <v-col cols="12" lg="6" md="12" sm="12" xs="12" class="border-right">
          <v-card tile>
            <v-card-title class="pl-8">
              <h5>
                <v-icon>mdi-cube-send</v-icon>
                Latest Blocks
              </h5>
            </v-card-title>
            <preview-list :items="summary.blocks">
              <template v-slot:default="item">
                <preview-block :info="item"></preview-block>
              </template>
            </preview-list>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6" md="12" sm="12" xs="12">
          <v-card tile>
            <v-card-title class="pl-8">
              <h5>
                <v-icon>mdi-send</v-icon>
                Latest Transactions
              </h5>
            </v-card-title>
            <preview-list :items="summary.txns">
              <template v-slot:default="item">
                <preview-txn :info="item"></preview-txn>
              </template>
            </preview-list>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script>
import common from '../scripts/common'
import PreviewTxn from '../components/util/misc/PreviewTxn.vue'
import PreviewBlock from '../components/util/misc/PreviewBlock.vue'
import PreviewList from '../components/util/PreviewList'
import ChartWrapper from '../components/util/charts/ChartWrapper'

export default {
  components: {
    ChartWrapper,
    PreviewList,
    PreviewTxn,
    PreviewBlock,
  },
  async middleware({ store }) {
    await store.dispatch('fetchStats')
    await store.dispatch('fetchPrices')
    await store.dispatch('fetchChainSummary')
    await store.dispatch('charts/fetchTransactions')
  },
  data() {
    return {
      errors: [],
      chartOptions: {
        chart: {
          type: 'line',
        },
        stroke: {
          show: true,
          curve: 'smooth',
          lineCap: 'butt',
          colors: undefined,
          width: 2,
          dashArray: 0,
        },
        colors: ['#6fceb7'],
        yaxis: {
          min(min) {
            return min - 750
          },
          max(max) {
            return max + 750
          },
          labels: {
            show: false,
          },
        },
        xaxis: {
          type: 'datetime',
          labels: {
            show: true,
          },
          axisTicks: {
            show: true,
          },
          crosshairs: {
            show: true,
          },
        },
        tooltip: {
          enabled: true,
          fillSeriesColor: true,
          x: {
            show: false,
          },
          y: {
            show: false,
          },
          fixed: {
            enabled: true,
            position: 'topLeft',
          },
        },
      },
      number: new Intl.NumberFormat('en', {}),
    }
  },
  computed: {
    stats() {
      return this.$store.state.stats
    },
    summary() {
      return this.$store.state.summary
    },
    prices() {
      return this.$store.state.prices
    },
    latestBlock() {
      return this.stats.latestBlock.number
    },
    chartData() {
      return [
        {
          ...this.$store.state.charts.txns,
          ...{ data: this.$store.state.charts.txns.data.slice(-28) },
        },
      ]
    },
  },
  created() {
    const self = this
    this.loop = setInterval(function () {
      self.now = self.$moment
      self.$store.dispatch('fetchStats')
      self.$store.dispatch('fetchChainSummary')
      self.$store.dispatch('fetchPrices')
    }, process.env.config.pollData)
  },
  methods: {
    calcMarketcap(supply, price) {
      return common.calcMarketcap(supply, price)
    },
    fromWei(supply) {
      return common.fromWei(supply, -1)
    },
  },
}
</script>
