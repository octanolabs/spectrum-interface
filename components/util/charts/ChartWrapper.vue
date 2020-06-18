<!--
   Base component that wraps <apexchart> and provides app-wide default options
   which are merged with options passed via props (styling, icons etc.)
 -->

<template>
  <apexchart v-if="sparkline" v-bind="chartProps" />
  <apexchart v-else height="500" v-bind="chartProps" />
</template>

<script>
import {
  mdiPlus,
  mdiMinus,
  mdiMagnify,
  mdiDownload,
  mdiAxisArrow,
  mdiSelection,
} from '@mdi/js'

export default {
  inheritAttrs: false,
  props: {
    sparkline: {
      type: Boolean,
      default: false,
    },
    lightToolbar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      plusSvg: `<svg xmlns="http://www.w3.org/2000/svg">
                 <path d="${mdiPlus}"/>
                </svg>
                `,
      minusSvg: `<svg xmlns="http://www.w3.org/2000/svg">
                 <path d="${mdiMinus}"/>
                </svg>
                `,
      magnifySvg: `<svg xmlns="http://www.w3.org/2000/svg">
                 <path d="${mdiMagnify}"/>
                </svg>
                `,
      downloadSvg: `<svg xmlns="http://www.w3.org/2000/svg" style="padding-left: 5px">
                 <path d="${mdiDownload}"/>
                </svg>
                `,
      panSvg: `<svg xmlns="http://www.w3.org/2000/svg" style="padding-left: 5px">
                 <path d="${mdiAxisArrow}"/>
                </svg>
                `,
      selectSvg: `<svg xmlns="http://www.w3.org/2000/svg">
                 <path d="${mdiSelection}"/>
                </svg>
                `,
    }
  },
  computed: {
    chartProps() {
      const { options: chartOptions, grid, ...rest } = this.$attrs

      if (!chartOptions) {
        return {}
      }

      const { theme, chart, xaxis, markers, ...opts } = chartOptions

      let toolbar = {}

      if (this.lightToolbar) {
        toolbar = {
          selection: false,
          zoomin: false,
          zoomout: false,
          zoom: false,
          pan: false,
          reset: false,
          download: this.downloadSvg,
        }
      } else {
        toolbar = {
          selection: true,
          zoomin: this.plusSvg,
          zoomout: this.minusSvg,
          zoom: this.magnifySvg,
          pan: this.panSvg,
          reset: true,
          download: this.downloadSvg,
        }
      }

      const props = {
        options: {
          theme: { mode: 'dark' },
          grid: { show: false },
          chart: {
            ...chart,
            ...{
              selection: {
                enabled: true,
              },
              toolbar: {
                show: true,
                tools: toolbar,
              },
            },
          },
          xaxis: {
            ...xaxis,
            axisBorder: {
              show: false,
            },
          },
          states: {
            hover: {
              filter: {
                type: 'none',
              },
            },
          },
          markers: {
            ...markers,
            ...{ strokeWidth: 0 },
          },
          ...opts,
        },
        ...rest,
      }

      if (this.sparkline) {
        return {
          ...props,
          ...{
            options: {
              ...props.options,
              chart: {
                ...props.options.chart,
                ...{
                  sparkline: { enabled: true },
                },
              },
            },
          },
        }
      } else {
        return props
      }
    },
  },
}
</script>
