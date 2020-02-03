<template>
  <div class="page-grid">
    <v-card dark class="stats">
      <v-row>
        <v-col cols="12">
          <v-card-title>
            <img
              src="../assets/logo-circle.svg"
              width="50"
              height="50"
              style="margin-top:-20px;"
            />
            <br />
            <span style="display:inline-block; margin-left: 10px">
              <small>
                MARKET CAP OF ${{ marketcap }} MILLION
                <br />
                ${{ priceUSD }} @ {{ priceBTC }} BTC/UBQ
              </small>
            </span>
          </v-card-title>
        </v-col>
        <v-col cols="12">
          <v-card-text align="bottom">
            <v-row style="padding:15px 15px 0 15px">
              <div>
                <h2 style="margin-bottom:0px;">LAST BLOCK</h2>
                <h4>{{ latestBlock }} ({{ summary.blocktime }}s)</h4>
              </div>
              <div class="text-right mr-0 ml-auto">
                <h2 style="margin-bottom:0px;">TRANSACTIONS</h2>
                <h4>{{ summary.txnCount }}</h4>
              </div>
            </v-row>
            <v-row style="padding:0px 15px">
              <div>
                <h3 style="margin-bottom:0px;">Hash Rate</h3>
                <h4>{{ summary.hashrate }} GH/s</h4>
              </div>
              <div class="text-right mr-0 ml-auto">
                <h3 style="margin-bottom:0px;">Network Difficulty</h3>
                <h4>{{ summary.difficulty }} TH</h4>
              </div>
            </v-row>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
    <v-card dark class="chart">
      <v-card-title> <h6>14 day Ubiq transaction history</h6> </v-card-title>
      <v-card-text>
        <LineChart :chart-data="chartData" max-height="200px" />
      </v-card-text>
    </v-card>
    <div class="blocks">
      <v-card class="card-home">
        <strong slot="header">Blocks</strong>
        <div v-for="(item, index) in summary.blocks" :key="index">
          <PreviewBlock :info="item" />
          <hr style="margin:5px 0 3px 0;" />
        </div>
      </v-card>
    </div>
    <div class="txns">
      <v-card class="card-home">
        <strong slot="header">Transactions</strong>
        <div v-for="(item, index) in summary.txns" :key="index">
          <PreviewTxn :info="item" />
        </div>
      </v-card>
    </div>

    <!--    <v-row justify-md="center" style="max-height: 400px">-->
    <!--      <v-col md="5">-->
    <!--        <v-card dark>-->
    <!--          <v-row>-->
    <!--            <v-col cols="12">-->
    <!--              <v-card-title>-->
    <!--                <img-->
    <!--                  src="../assets/logo-circle.svg"-->
    <!--                  width="50"-->
    <!--                  height="50"-->
    <!--                  style="margin-top:-20px;"-->
    <!--                />-->
    <!--                <br />-->
    <!--                <span style="display:inline-block; margin-left: 10px">-->
    <!--                  <small>-->
    <!--                    MARKET CAP OF ${{ marketcap }} MILLION-->
    <!--                    <br />-->
    <!--                    ${{ priceUSD }} @ {{ priceBTC }} BTC/UBQ-->
    <!--                  </small>-->
    <!--                </span>-->
    <!--              </v-card-title>-->
    <!--            </v-col>-->
    <!--            <v-col cols="12">-->
    <!--              <v-card-text align="bottom">-->
    <!--                <v-row style="padding:15px 15px 0 15px">-->
    <!--                  <div>-->
    <!--                    <h2 style="margin-bottom:0px;">LAST BLOCK</h2>-->
    <!--                    <h4>{{ latestBlock }} ({{ summary.blocktime }}s)</h4>-->
    <!--                  </div>-->
    <!--                  <div class="text-right mr-0 ml-auto">-->
    <!--                    <h2 style="margin-bottom:0px;">TRANSACTIONS</h2>-->
    <!--                    <h4>{{ summary.txnCount }}</h4>-->
    <!--                  </div>-->
    <!--                </v-row>-->
    <!--                <v-row style="padding:0px 15px">-->
    <!--                  <div>-->
    <!--                    <h3 style="margin-bottom:0px;">Hash Rate</h3>-->
    <!--                    <h4>{{ summary.hashrate }} GH/s</h4>-->
    <!--                  </div>-->
    <!--                  <div class="text-right mr-0 ml-auto">-->
    <!--                    <h3 style="margin-bottom:0px;">Network Difficulty</h3>-->
    <!--                    <h4>{{ summary.difficulty }} TH</h4>-->
    <!--                  </div>-->
    <!--                </v-row>-->
    <!--              </v-card-text>-->
    <!--            </v-col>-->
    <!--          </v-row>-->
    <!--        </v-card>-->
    <!--      </v-col>-->
    <!--      <v-col md="5">-->
    <!--        <v-card class="text-center card-dark">-->
    <!--          <h6>14 day Ubiq transaction history</h6>-->
    <!--          <LineChart :chart-data="chartData" options="{height:'50%'}" />-->
    <!--        </v-card>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
    <!--    <v-row justify-md="center" style="margin-top:20px;">-->
    <!--      <v-col md="5" class="d-none d-md-block">-->
    <!--        <v-card class="card-home">-->
    <!--          <strong slot="header">Blocks</strong>-->
    <!--          <div v-for="(item, index) in summary.blocks" :key="index">-->
    <!--            <PreviewBlock :info="item" />-->
    <!--            <hr style="margin:5px 0 3px 0;" />-->
    <!--          </div>-->
    <!--        </v-card>-->
    <!--      </v-col>-->
    <!--      <v-col md="5" class="d-none d-md-block">-->
    <!--        <v-card class="card-home">-->
    <!--          <strong slot="header">Transactions</strong>-->
    <!--          <div v-for="(item, index) in summary.txns" :key="index">-->
    <!--            <PreviewTxn :info="item" />-->
    <!--          </div>-->
    <!--        </v-card>-->
    <!--      </v-col>-->
    <!--    </v-row>-->
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
        labels: this.stats.txnCounts.labels.slice(-14),
        series: [
          {
            data: this.stats.txnCounts.data.slice(-14)
          }
        ]
      }
    }
  },
  fetch({ store }) {
    store.dispatch('fetchIndexState')
    store.dispatch('fetchChainSummary')
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

<style>
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
}

.stats {
  grid-area: stats;
}
.chart {
  grid-area: chart;
  height: 100%;
}
.blocks {
  grid-area: blocks;
}
.txns {
  grid-area: txns;
}
</style>
