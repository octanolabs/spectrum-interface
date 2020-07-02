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
  },
  data() {
    return {
      activeChart: 0,
      chartOptions: [
        {
          title: {
            text:
              'Max Daily Block Capacity (mined blocks * gasLimit) / Total gas used in transactions',
            style: {
              fontFamily: 'Courier New',
            },
          },
          fill: {
            opacity: 0.3,
          },
          stroke: {
            show: true,
            curve: 'straight',
            width: 1,
            dashArray: 0,
          },
          colors: ['#ea9c00', '#ea0000'],
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
              forceNiceScale: true,
              logarithmic: false,
              labels: {
                show: false,
              },
            },
          ],
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
      chartData: [
        [
          { name: 'Gaslimit', type: 'area', data: this.gasLimit },
          { name: 'GasUsed', type: 'line', data: this.gasUsed },
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
            position: 'topRight',
            offsetX: -200,
          },
        },
        ...obj,
      }
    },
  },
}
</script>
