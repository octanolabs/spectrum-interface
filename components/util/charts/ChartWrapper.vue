<!--
   Base component that wraps <apexchart> and provides app-wide default options
   which are merged with options passed via props (styling, icons etc.)
 -->

<template>
  <apexchart v-if="sparkline" ref="apexchart" v-bind="chartProps" />
  <apexchart
    v-else
    :key="reloadChartKey"
    ref="apexchart"
    :height="this.$attrs.height ? this.$attrs.height : 500"
    v-bind="chartProps"
  />
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
      reloadChartKey: 0,
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
      const { options: chartOptions, ...rest } = this.$attrs

      if (!chartOptions) {
        return {}
      }

      const { theme, chart, xaxis, markers, tooltip, ...opts } = chartOptions

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
          zoomin: false,
          zoomout: false,
          zoom: false,
          pan: false,
          reset: false,
          download: this.downloadSvg,
        }
      }

      const props = {
        options: {
          theme: {
            mode: 'dark',
            palette: 'palette3',
            monochrome: { enabled: false },
          },
          grid: { show: false },
          chart: {
            ...chart,
            ...{
              id: 'apexchart',
              background: 'transparent',
              selection: {
                enabled: true,
              },
              animations: {
                enabled: false,
              },
              toolbar: {
                show: true,
                tools: toolbar,
              },
              events: {
                // Arrow function's this is bound to Vue instance (??)
                selection: (e, o) => {
                  this.$emit('selectRange', o)
                },
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
          tooltip: {
            ...tooltip,
            theme: 'dark',
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
  watch: {
    // vue-apexcharts acts up when we cange both options and series at the same time so
    // to avoid it every time chartprops change the apexchart component is re-rendered
    // by using a key ()
    '$attrs.options': {
      handler() {
        this.reloadChartKey = this.$moment().unix()
      },
    },
  },
  methods: {
    updateChart({ series, options }) {
      this.$apexcharts.exec('apexchart', 'updateOptions', {
        ...options,
      })
      this.$apexcharts.exec('apexchart', 'updateSeries', series)
    },
  },
}
</script>
