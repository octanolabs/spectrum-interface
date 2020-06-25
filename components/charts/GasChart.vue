<template>
  <chart-view
    :chart-names="['gasLimit/gasUsed', 'gasPrice Levels', 'gas Levels']"
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
    gasLimitLevels: {
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
          colors: ['#00ea90', '#ef6221', '#555555'],
          annotations: {
            yaxis: [],
          },
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            width: 1,
            dashArray: 0,
          },
          fill: {
            opacity: 1,
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
          yaxis: [
            { seriesName: 'Blocks', labels: { show: false } },
            {
              seriesName: 'Supply',
              labels: {
                show: false,
                formatter: (val) =>
                  `${common.formatNumber(common.fromWei(val, 0))} UBQ`,
              },
            },
          ],
        },
        {
          annotations: {
            position: 'front',
            yaxis: [
              {
                y: 88,
                strokeDashArray: 1,
                borderColor: '#00ea90',
                label: {
                  text: '88 second target',
                  borderColor: '#00ea90',
                  offsetY: -20,
                  style: {
                    background: 'transparent',
                  },
                },
              },
            ],
          },
          colors: ['#00ea90', '#ef6221', '#555555'],
          fill: {
            colors: ['#00ea90', '#ef6221', '#555555'],
            type: 'solid',
            opacity: [1, 0.35],
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
            type: 'datetime',
            labels: {
              show: false,
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
          yaxis: [
            {
              seriesName: 'Average daily block time',
              labels: {
                show: false,
              },
            },
            {
              seriesName: 'Difficulty',
              labels: {
                show: false,
                formatter: (val) => `${common.toTH(val, 3)} TH`,
              },
            },
          ],
        },
      ],
      chartData: [
        [
          { name: 'Blocks', type: 'line', data: this.blocks },
          { name: 'Supply', type: 'line', data: this.supply },
        ],
        [
          {
            name: 'Average daily block time',
            type: 'line',
            data: this.blockTime,
          },
          { name: 'Difficulty', type: 'area', data: this.difficulty },
        ],
      ],
    }
  },
}
</script>
