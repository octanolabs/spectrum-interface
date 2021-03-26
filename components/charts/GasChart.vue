<template>
  <chart-view
    :chart-names="[
      'gasLimit/gasUsed',
      'gasPrice Levels',
      'gasUsed Levels',
      'gas Levels',
    ]"
    height="750"
    :chart-options="chartOptions"
    :chart-data="chartData"
    :types="['line', 'line']"
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
    gasLimit: {
      type: Array,
      required: true,
      default: () => [],
    },
    gasUsed: {
      type: Array,
      required: false,
      default: () => [],
    },
    gasPriceLevels: {
      type: Array,
      required: false,
      default: () => [],
    },
    gasUsedLevels: {
      type: Array,
      required: false,
      default: () => [],
    },
    gasLevels: {
      type: Array,
      required: false,
      default: () => [],
    },
    avgGasPrice: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      activeChart: 0,
      chartData: [
        [
          { name: 'Gas Limit', type: 'area', data: this.gasLimit },
          { name: 'Gas Used', type: 'area', data: this.gasUsed },
          { name: 'Avg. Gas Price', type: 'line', data: this.avgGasPrice },
        ],
        this.gasPriceLevels.map(({ name, data }) => {
          return { name, data, type: 'area' }
        }),
        this.gasUsedLevels.map(({ name, data }) => {
          return { name, data, type: 'area' }
        }),
        this.gasLevels.map(({ name, data }) => {
          return { name, data, type: 'area' }
        }),
      ],
      chartOptions: [
        {
          fill: {
            opacity: [1, 1, 0.5, 0.5],
            type: 'solid',
          },
          stroke: {
            show: true,
            curve: 'straight',
            width: 1,
            dashArray: 0,
          },
          colors: ['#2e2e2e', '#6fceb7', '#ff00ff'],
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
          yaxis: [
            {
              seriesName: 'Gas Limit',
              labels: {
                show: false,
              },
              forceNiceScale: false,
              logarithmic: false,
            },
            {
              seriesName: 'Gas Limit',
              labels: {
                show: false,
              },
              forceNiceScale: false,
              logarithmic: false,
            },
            {
              opposite: true,
              seriesName: 'Avg. Gas Price',
              labels: {
                show: false,
                formatter: (label) => `${common.fromWeiToGwei(label, 2)} Gwei`,
              },
            },
          ],
          tooltip: {
            enabled: true,
            fixed: {
              enabled: true,
              position: 'topLeft',
            },
          },
        },
        this.defaultChartLevelOptions({
          xaxis: {
            type: 'datetime',
            categories: this.gasLevels[0].timestamps,
            labels: {
              show: false,
            },
          },
          yaxis: [
            {
              labels: {
                show: false,
              },
            },
          ],
        }),
        this.defaultChartLevelOptions({
          xaxis: {
            type: 'datetime',
            categories: this.gasLevels[0].timestamps,
            labels: {
              show: false,
            },
          },
          yaxis: [
            {
              forceNiceScale: false,
              labels: {
                show: false,
              },
            },
          ],
        }),
        this.defaultChartLevelOptions({
          xaxis: {
            type: 'datetime',
            categories: this.gasLevels[0].timestamps,
            labels: {
              show: false,
            },
          },
          yaxis: [
            {
              forceNiceScale: false,
              labels: {
                show: false,
              },
            },
          ],
        }),
      ],
    }
  },
  methods: {
    defaultChartLevelOptions(obj = {}) {
      return {
        markers: {
          size: 0,
        },
        theme: {
          pallette: 'pallette3',
        },
        fill: {
          opacity: 0.3,
        },
        stroke: {
          show: true,
          curve: 'smooth',
          lineCap: 'butt',
          width: 1,
          dashArray: 0,
        },
        chart: {
          stacked: true,
          animations: {
            enabled: false,
          },
        },
        tooltip: {
          enabled: true,
          fixed: {
            enabled: true,
            position: 'topLeft',
          },
        },
        ...obj,
      }
    },
  },
}
</script>
