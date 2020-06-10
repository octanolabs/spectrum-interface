<template>
  <chart-view
    :chart-names="['txns/gasPrice', 'gaslimit']"
    :chart-options="chartOptions"
    :chart-data="chartData"
  >
  </chart-view>

  <!--  <v-card outlined>-->
  <!--    {{ activeChart }}-->
  <!--    <v-card-title>-->
  <!--      <v-radio-group v-model="activeChart" row>-->
  <!--        <v-radio label="" name="txns/gasPrice">-->
  <!--          txns/gasPrice-->
  <!--        </v-radio>-->
  <!--        <v-radio label="" name="gaslimit">-->
  <!--          gaslimit-->
  <!--        </v-radio>-->
  <!--      </v-radio-group>-->
  <!--    </v-card-title>-->
  <!--    <v-card-text>-->
  <!--      <chart-wrapper-->
  <!--        v-bind="$attrs"-->
  <!--        :series="chartData"-->
  <!--        :options="chartOptions"-->
  <!--      />-->
  <!--    </v-card-text>-->
  <!--  </v-card>-->
</template>

<script>
import ChartView from '../util/charts/ChartView'
import common from '~/scripts/common'

export default {
  components: { ChartView },
  inheritAttrs: false,
  props: {
    txns: {
      type: Array,
      required: true,
      default: () => []
    },
    prices: {
      type: Array,
      required: false,
      default: () => []
    },
    avgGasPrice: {
      type: Array,
      required: false,
      default: () => []
    },
    txFees: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  data() {
    return {
      activeChart: 0,
      chartOptions: [
        {
          chart: {
            type: 'line',
            zoom: {
              autoScaleYaxis: true
            }
          },
          colors: ['#00ea90', '#ef6221', '#555555'],
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 1,
            dashArray: 0
          },
          xaxis: {
            type: 'datetime',
            labels: {
              show: false
            },
            axisTicks: {
              show: false
            },
            tooltip: {
              formatter: (val) =>
                this.$moment(val)
                  .utc()
                  .format('YYYY-MM-DD')
            }
          },
          yaxis: [
            { seriesName: 'Transactions' },
            {
              seriesName: 'Avg. Gas Price',
              labels: {
                show: false,
                formatter: (label) => `${common.fromWeiToGwei(label, 2)} Gwei`
              }
            },
            {
              seriesName: 'Tx fees',
              labels: {
                show: false,
                formatter: (label, idx) => `${label} (${this.prices[idx]}) $`
              }
            }
          ]
        },
        {
          chart: {
            type: 'line'
          },
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 1,
            dashArray: 0
          },
          xaxis: {
            labels: {
              show: false
            }
          },
          yaxis: [{ name: 'GasLimit', data: this.gasLimit }]
        }
      ],
      chartData: [
        [
          { name: 'Transactions', data: this.txns },
          { name: 'Avg. Gas Price', type: 'line', data: this.avgGasPrice },
          { name: 'Tx fees', type: 'line', data: this.txFees }
        ],
        [{ name: 'GasLimit', data: this.gasLimit }]
      ]
    }
  }
  // computed: {
  //   chartData() {
  //     switch (this.activeChart) {
  //       case 0:
  //         return
  //       case 1:
  //         return
  //     }
  //     return []
  //   },
  //   chartOptions() {
  //     switch (this.activeChart) {
  //       case 0:
  //         return {
  //           chart: {
  //             type: 'line',
  //             zoom: {
  //               autoScaleYaxis: true
  //             }
  //           },
  //           colors: ['#00ea90', '#ef6221', '#555555'],
  //           stroke: {
  //             show: true,
  //             curve: 'smooth',
  //             lineCap: 'butt',
  //             colors: undefined,
  //             width: 1,
  //             dashArray: 0
  //           },
  //           xaxis: {
  //             type: 'datetime',
  //             labels: {
  //               show: false
  //             },
  //             axisTicks: {
  //               show: false
  //             },
  //             tooltip: {
  //               formatter: (val) =>
  //                 this.$moment(val)
  //                   .utc()
  //                   .format('YYYY-MM-DD')
  //             }
  //           },
  //           yaxis: [
  //             { seriesName: 'Transactions' },
  //             {
  //               seriesName: 'Avg. Gas Price',
  //               min: 500000000, // 0.5 Gwei
  //               max: 1000 * 1000000000, // 100 Gwei
  //               labels: {
  //                 show: false,
  //                 formatter: (label) => `${common.fromWeiToGwei(label, 2)} Gwei`
  //               }
  //             },
  //             {
  //               seriesName: 'Tx fees',
  //               labels: {
  //                 show: false,
  //                 formatter: (label, idx) => `${label} (${this.prices[idx]}) $`
  //               }
  //             }
  //           ]
  //         }
  //       case 1:
  //         return {
  //           chart: {
  //             type: 'line'
  //           },
  //           stroke: {
  //             show: true,
  //             curve: 'smooth',
  //             lineCap: 'butt',
  //             colors: undefined,
  //             width: 1,
  //             dashArray: 0
  //           },
  //           xaxis: {
  //             labels: {
  //               show: false
  //             }
  //           },
  //           yaxis: [{ name: 'GasLimit', data: this.gasLimit }]
  //         }
  //     }
  //     return []
  //   }
  // }
}
</script>

<style lang="css">
.ct-series-a .ct-line {
  /* Set the colour of this series line */
  stroke: #00ea90;
  /* Control the thikness of your lines */
  stroke-width: 2.5px;
}

.ct-series-a .ct-point {
  stroke-linecap: butt;
}
</style>
