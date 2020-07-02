<template>
  <chart-view
    :chart-names="['txns/gasPrice']"
    :chart-options="chartOptions"
    :chart-data="chartData"
  >
  </chart-view>
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
      default: () => [],
    },
    prices: {
      type: Array,
      required: false,
      default: () => [],
    },
    avgGasPrice: {
      type: Array,
      required: false,
      default: () => [],
    },
    txFees: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      activeChart: 0,
      chartOptions: [
        {
          colors: [
            'rgba(0,234,144,0.2)',
            'rgba(225,239,33,0.75)',
            '#00ea90',
            '#2261cd',
          ],
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            width: 1,
            dashArray: 0,
          },
          xaxis: {
            type: 'datetime',
            labels: {
              show: false,
            },
            axisTicks: {
              show: false,
            },
            tooltip: {
              formatter: (val) => this.$moment(val).utc().format('YYYY-MM-DD'),
            },
          },
          chart: {
            animations: {
              enabled: false,
            },
          },
          tooltip: {
            enabledOnSeries: [0, 1, 2],
          },
          yaxis: [
            {
              seriesName: 'Transactions',
              labels: {
                show: false,
                formatter: (label) => label.toFixed(),
              },
            },
            {
              seriesName: 'Avg. Gas Price',
              labels: {
                show: false,
                formatter: (label) => `${common.fromWeiToGwei(label, 2)} Gwei`,
              },
            },
            {
              seriesName: 'Cumulative Tx fees',
              labels: {
                show: false,
                formatter(label, { series, dataPointIndex }) {
                  return `
                  ${series[2][dataPointIndex]} UBQ
                  (${common.mulFiat(
                    series[2][dataPointIndex],
                    series[3][dataPointIndex],
                    2
                  )} $)`
                },
              },
            },
            {
              seriesName: 'Price',
              labels: {
                show: false,
              },
            },
          ],
        },
        {
          chart: {
            type: 'line',
          },
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 1,
            dashArray: 0,
          },
          xaxis: {
            labels: {
              show: false,
            },
          },
          yaxis: [{ name: 'GasLimit', data: this.gasLimit }],
        },
      ],
      chartData: [
        [
          { name: 'Transactions', type: 'column', data: this.txns },
          { name: 'Avg. Gas Price', type: 'line', data: this.avgGasPrice },
          { name: 'Cumulative Tx fees', type: 'line', data: this.txFees },
          { name: 'Price', type: 'line', data: this.prices },
        ],
      ],
    }
  },
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
