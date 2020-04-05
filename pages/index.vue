<template>
  <div class="page-grid">
    <v-card dark class="stats d-flex flex-column justify-end">
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
    <v-card class="chart">
      <v-card-title> <h6>14 day Ubiq transaction history</h6> </v-card-title>
      <v-card-text>
        <LineChart :chart-data="chartData" max-height="200px" />
      </v-card-text>
    </v-card>
    <v-card class="blocks">
      <v-card-title>
        <h3>
          Latest Blocks
        </h3>
      </v-card-title>
      <v-simple-table height="575px">
        <template v-slot:default>
          <tbody>
            <template v-for="(item, idx) in summary.blocks">
              <div :key="idx">
                <PreviewBlock :info="item" />
                <hr style="margin:5px 0 3px 0;" />
              </div>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
    <v-card class="txns">
      <v-card-title>
        <h3>
          Latest Transactions
        </h3>
      </v-card-title>
      <v-simple-table height="575px">
        <template v-slot:default>
          <tbody>
            <template v-for="(item, idx) in summary.txns">
              <div :key="idx">
                <PreviewTxn :info="item" />
                <hr style="margin:5px 0 3px 0;" />
              </div>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
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
        labels: [],
        series: [
          {
            data: []
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
</style>
