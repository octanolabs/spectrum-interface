<template>
  <div class="body-2">
    <v-row justify="center">
      <v-col sm="7" md="10" lg="5">
        <v-card
          style="height: 100%"
          dark
          class=" d-flex flex-column justify-end"
        >
          <v-card-title>
            <img
              src="../assets/logo-circle.svg"
              width="50"
              height="50"
              style="margin-top:-20px;"
            />
            <span style="display:inline-block; margin-left: 10px">
              <small>
                MARKET CAP OF ${{
                  calcMarketcap(
                    fromWei(stats.supply / 1000000, -1),
                    prices.ubq.usd
                  )
                }}
                MILLION @
                {{ calcMarketcap(fromWei(stats.supply, -1), prices.ubq.btc) }}
                BTC
                <br />
                ${{ prices.ubq.usd.toFixed(3) }} @ {{ prices.ubq.btc }} BTC/UBQ
              </small>
            </span>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card-text>
            <v-row>
              <v-col cols="4" class="text-left">
                <div>
                  <h2 style="margin-bottom:0px;">LAST BLOCK</h2>
                  <h4>{{ latestBlock }} ({{ summary.blocktime }}s)</h4>
                </div>
                <div>
                  <h2 style="margin-bottom:0px;">TRANSACTIONS</h2>
                  <h4>{{ summary.txnCount }}</h4>
                </div>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="4" class="text-right">
                <div>
                  <h3 style="margin-bottom:0px;">Hash Rate</h3>
                  <h4>{{ summary.hashrate }} GH/s</h4>
                </div>
                <div>
                  <h3 style="margin-bottom:0px;">Network Difficulty</h3>
                  <h4>{{ summary.difficulty }} TH</h4>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="7" md="10" lg="5">
        <v-card class="">
          <v-card-title>
            <h6>28 day Ubiq transaction history</h6>
          </v-card-title>
          <v-card-text>
            <chart-wrapper
              light-toolbar
              :series="chartData"
              :options="chartOptions"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col sm="7" md="10" lg="5">
        <v-card class="">
          <v-card-title>
            <h3>
              Latest Blocks
            </h3>
          </v-card-title>
          <preview-list max-height="545px" :items="summary.blocks">
            <template v-slot:default="item">
              <preview-block :info="item"></preview-block>
            </template>
          </preview-list>
        </v-card>
      </v-col>
      <v-col sm="7" md="10" lg="5">
        <v-card class="">
          <v-card-title>
            <h3>
              Latest Transactions
            </h3>
          </v-card-title>
          <preview-list max-height="545px" :items="summary.txns">
            <template v-slot:default="item">
              <preview-txn :info="item"></preview-txn>
            </template>
          </preview-list>
        </v-card>
      </v-col>
    </v-row>
  </div>
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
    PreviewBlock
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
          type: 'line'
        },
        stroke: {
          show: true,
          curve: 'smooth',
          lineCap: 'butt',
          colors: undefined,
          width: 2,
          dashArray: 0
        },
        colors: ['#00ea90'],
        yaxis: {
          min(min) {
            return min - 750
          },
          max(max) {
            return max + 750
          },
          labels: {
            show: false
          }
        },
        xaxis: {
          type: 'datetime',
          labels: {
            show: false
          },
          axisTicks: {
            show: false
          },
          crosshairs: {
            show: false
          }
        },
        tooltip: {
          enabled: true,
          fillSeriesColor: true,
          x: {
            show: false
          },
          y: {
            show: true
          },
          fixed: {
            enabled: true,
            position: 'topLeft'
          }
        }
      }
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
          ...{ data: this.$store.state.charts.txns.data.slice(-28) }
        }
      ]
    }
    // chartData() {
    //   return {
    //     labels: this.stats.txnCounts.labels.slice(-14),
    //     series: [
    //       {
    //         data: this.stats.txnCounts.data.slice(-14)
    //       }
    //     ]
    //   }
    // }
  },
  created() {
    const self = this
    this.loop = setInterval(function() {
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
    }
  }
}
</script>
