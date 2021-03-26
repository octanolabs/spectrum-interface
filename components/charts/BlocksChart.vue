<template>
  <chart-view
    :chart-names="['blocks/supply', 'blockTime/diffculty']"
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
    blocks: {
      type: Array,
      required: true,
      default: () => [],
    },
    blockTime: {
      type: Array,
      required: false,
      default: () => [],
    },
    difficulty: {
      type: Array,
      required: false,
      default: () => [],
    },
    supply: {
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
          annotations: {
            position: 'front',
            yaxis: [
              {
                y: 982,
                strokeDashArray: 1,
                borderColor: '#FF00FF',
                label: {
                  text: '982 block target',
                  borderColor: '#FF00FF',
                  offsetY: -20,
                  style: {
                    background: 'transparent',
                  },
                },
              },
            ],
          },
          colors: ['#6fceb7', '#e76754', '#FF00FF'],
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            width: 2,
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
          tooltip: {
            enabled: true,
            fixed: {
              enabled: true,
              position: 'topLeft',
            },
          },
        },
        {
          annotations: {
            position: 'front',
            yaxis: [
              {
                y: 88,
                strokeDashArray: 1,
                borderColor: '#FF00FF',
                label: {
                  text: '88 second target',
                  borderColor: '#FF00FF',
                  offsetY: -20,
                  style: {
                    background: 'transparent',
                  },
                },
              },
            ],
          },
          colors: ['#6fceb7', '#2e2e2e', '#FF00FF'],
          fill: {
            type: 'solid',
            opacity: [1, 1],
          },
          stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            colors: undefined,
            width: 2,
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
          tooltip: {
            enabled: true,
            fixed: {
              enabled: true,
              position: 'topLeft',
            },
          },
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
