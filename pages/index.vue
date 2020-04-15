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
                MARKET CAP OF ${{ marketcap }} MILLION
                <br />
                ${{ priceUSD }} @ {{ priceBTC }} BTC/UBQ
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
            <h6>14 day Ubiq transaction history</h6>
          </v-card-title>
          <v-card-text>
            <LineChart :chart-data="chartData" max-height="200px" />
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
          <perfect-scrollbar>
            <v-list max-height="545px">
              <v-list-item
                v-for="(item, idx) in summary.blocks"
                :key="idx"
                three-line
              >
                <PreviewBlock :info="item" />
                <hr style="margin:5px 0 3px 0;" />
              </v-list-item>
            </v-list>
          </perfect-scrollbar>
        </v-card>
      </v-col>
      <v-col sm="7" md="10" lg="5">
        <v-card class="">
          <v-card-title>
            <h3>
              Latest Transactions
            </h3>
          </v-card-title>
          <perfect-scrollbar>
            <v-list max-height="545px">
              <v-list-item
                v-for="(item, idx) in summary.txns"
                :key="idx"
                two-line
              >
                <PreviewTxn :info="item" />
                <hr style="margin:5px 0 3px 0;" />
              </v-list-item>
            </v-list>
          </perfect-scrollbar>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import LineChart from '../components/charts/Line'
import common from '../scripts/common'
import PreviewTxn from '../components/PreviewTxn.vue'
import PreviewBlock from '../components/PreviewBlock.vue'

export default {
  components: {
    LineChart,
    PreviewTxn,
    PreviewBlock
  },
  middleware({ store }) {
    store.dispatch('fetchIndexState')
    store.dispatch('fetchChainSummary')
  },
  data() {
    return {
      errors: [],
      chartOptions: {
        scales: {
          xAxes: [
            {
              display: false
            }
          ],
          yAxes: [
            {
              ticks: {
                min: 0
              },
              fontColor: 'rgba(255,255,255,0.5)'
            }
          ]
        },
        legend: {
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
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
    latestBlock() {
      return this.stats.latestBlock.number
    },
    priceUSD() {
      return parseFloat(this.stats.price.usd).toFixed(4)
    },
    priceBTC() {
      return this.stats.price.btc
    },
    marketcap() {
      return (
        common.mulFiat(
          common.fromWei(this.stats.supply),
          this.stats.price.usd,
          2
        ) / 1000000
      ).toFixed(2)
    },
    chartData() {
      return {
        labels: [
          '25/3',
          '26/3',
          '27/3',
          '28/3',
          '29/3',
          '30/3',
          '31/3',
          '1/4',
          '2/4',
          '3/4',
          '4/4',
          '5/4',
          '6/4',
          '7/4'
        ],
        series: [
          {
            data: [
              2124,
              2178,
              2115,
              1798,
              2021,
              2049,
              2054,
              2037,
              2137,
              2005,
              1947,
              1949,
              2098,
              2084
            ]
          }
        ]
      }
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
      self.$store.dispatch('fetchIndexState')
      self.$store.dispatch('fetchChainSummary')
    }, process.env.config.pollData)
  }
}
</script>

<style lang="scss">
.page-grid {
  display: grid;
  grid-template-columns: 0.2fr 1fr 1fr 0.2fr;
  grid-template-rows: auto 1fr;
  width: 100%;
  grid-gap: 20px;

  /*grid-template-rows: 30px 40% 40% 30px;*/
  grid-template-areas:
    '. stats chart .'
    '. blocks txns .';

  @include for-phone-only {
    grid-template-columns: 0.05fr auto 0.05fr;
    grid-template-rows: auto auto auto auto;

    grid-template-areas:
      '. stats  .'
      '. chart .'
      '. blocks .'
      '. txns .';
  }
}

.stats {
  grid-area: stats;
}
.chart {
  grid-area: chart;
}
.blocks {
  grid-area: blocks;
}
.txns {
  grid-area: txns;
}

.ct-series-a .ct-line {
  stroke: $ubiq-green;
  stroke-width: 5px;
}

.ct-series-a .ct-point {
  stroke: $ubiq-green;
  stroke-width: 10px;
  stroke-linecap: round;
}
</style>
