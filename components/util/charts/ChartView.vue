<!--
  ChartView wraps ChartWrapper adding a date picker and radio toggles
  to switch between different chart data/option pairs
  params are arrays. first chart name will correspond to first options object and first data object
  default behaviour for chart series is they're sliced to fit one year of data. If dates are picked with datepicker those are used.
  since all chart series are the same date-wise, we just find the index for one of them and use them to slice all of them
-->

<!--
  TODO: when zooming in with the selection tool, series showed/hidden with
   the controls on the bottom are reset, find out how to fix
-->

<template>
  <v-card outlined>
    <v-card-title>
      <div class="d-flex align-center" style="width: 100%;">
        <v-col cols="2">
          <v-menu
            ref="menu"
            v-model="menu"
            :close-on-content-click="false"
            :return-value.sync="dates"
            transition="scale-transition"
            offset-y
            min-width="310px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="From ~ To"
                prepend-icon="mdi-calendar-range"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="dates" range no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(dates)"
                >OK</v-btn
              >
            </v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-btn
            text
            color="primary"
            small
            dark
            @click="setShowDataPoints('6m')"
          >
            6m
          </v-btn>
          <v-btn
            text
            color="primary"
            small
            dark
            @click="setShowDataPoints('1y')"
          >
            1y
          </v-btn>
          <v-btn
            text
            color="primary"
            small
            dark
            @click="setShowDataPoints('3y')"
          >
            3y
          </v-btn>
          <v-btn text color="primary" small dark @click="setShowDataPoints()">
            Show all data points
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            v-if="selectionSuggestedDates.length > 0"
            text
            color="warning"
            small
            elevation="3"
            @click="
              () => {
                dates = selectionSuggestedDates
                selectionSuggestedDates = []
              }
            "
          >
            Zoom in: {{ selectionSuggestedDates[0] }}
            {{ selectionSuggestedDates[1] }}
          </v-btn>
          <v-btn v-else small text disabled>
            Use selection too to zoom in
          </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-radio-group v-model="activeChart" row mandatory>
            <v-radio
              v-for="(item, idx) in chartNames"
              :key="idx"
              :label="item"
              :name="item"
              :value="item"
            >
              {{ item }}
            </v-radio>
          </v-radio-group>
        </v-col>
      </div>
    </v-card-title>
    <v-card-text>
      <!-- Why bound to $attrs? -->
      <chart-wrapper
        ref="chart"
        v-bind="$attrs"
        :series="data"
        :options="options"
        @selectRange="selectedRange"
      />
    </v-card-text>
  </v-card>
</template>

<script>
import ChartWrapper from './ChartWrapper'

export default {
  components: {
    ChartWrapper,
  },
  inheritAttrs: false,
  props: {
    chartNames: {
      type: Array,
      required: true,
      default: () => null,
    },
    chartOptions: {
      type: Array,
      required: true,
      default: () => [],
    },
    chartData: {
      type: Array,
      required: true,
      default: () => null,
    },
  },
  data() {
    return {
      activeChart: null,
      menu: false,
      dates: [],
      selectionSuggestedDates: [],
      data: [],
      options: {},
    }
  },
  computed: {
    sliceDateRange() {
      const [[{ data: series }]] = this.chartData

      if (!series) {
        return []
      }

      const { x: earliestDate } = series[series.length - 1]

      const [from, to] =
        this.dates.length !== 2
          ? [
              this.$moment(earliestDate).subtract(1, 'years').unix() * 1000,
              this.$moment(earliestDate).unix() * 1000,
            ]
          : [
              this.$moment(this.dates[0], 'YYYY-MM-DD').unix() * 1000,
              this.$moment(this.dates[1], 'YYYY-MM-DD').unix() * 1000,
            ]

      return this.findStampInSeries(from, to, series)
    },
    dateRangeText() {
      return this.dates.join(' ~ ')
    },
    keyedOptions() {
      const options = {}

      for (let i = 0; i < this.chartNames.length; i++) {
        const name = this?.chartNames[i]
        if (!name) {
          return {}
        }
        options[name] = this.chartOptions[i]
      }

      return options
    },
    keyedSeries() {
      const series = {}

      for (let i = 0; i < this.chartData.length; i++) {
        const name = this?.chartNames[i]
        if (!name) {
          return {}
        }
        series[name] = this.chartData[i]
      }

      return series
    },
  },
  watch: {
    activeChart: {
      handler(newChart) {
        const [startIdx, endIdx] = this.sliceDateRange
        const key = newChart || this.chartNames[0]

        this.options = this.keyedOptions[key]

        // Array.slice includes start element and excludes end element
        this.data = this.keyedSeries[key].map(({ name, type, data }) => {
          return {
            name,
            type,
            data: data.slice(startIdx, endIdx + 1),
          }
        })
      },
      immediate: true,
    },
    sliceDateRange: {
      handler([startIdx, endIdx]) {
        this.data = this.keyedSeries[this.activeChart].map(
          ({ name, type, data }) => {
            return {
              name,
              type,
              data: data.slice(startIdx, endIdx + 1),
            }
          }
        )
      },
    },
    dates: {
      handler(dates) {
        const [[{ data: series }]] = this.chartData
        const { x: earliestDate } = series[series.length - 1]

        if (dates.length === 0) {
          this.dates = [
            this.$moment(earliestDate)
              .subtract(1, 'years')
              .format('YYYY-MM-DD'),
            this.$moment(earliestDate).format('YYYY-MM-DD'),
          ]
        }

        const [from, to] = dates
        if (
          this.$moment(from, 'YYYY-MM-DD').isAfter(
            this.$moment(to, 'YYYY-MM-DD')
          )
        ) {
          this.dates = [to, from]
        }

        if (
          this.$moment(from, 'YYYY-MM-DD').isBefore(
            this.$moment(earliestDate, 'YYYY-MM-DD')
          )
        ) {
          this.dates = [this.$moment(earliestDate).format('YYYY-MM-DD'), to]
        }
      },
      immediate: true,
    },
  },
  methods: {
    selectedRange({ xaxis, yaxis }) {
      this.selectionSuggestedDates = [
        this.$moment(xaxis.min).format('YYYY-MM-DD'),
        this.$moment(xaxis.max).format('YYYY-MM-DD'),
      ]
    },
    setShowDataPoints(period = 'all') {
      const [[{ data: series }]] = this.chartData
      switch (period) {
        case '6m':
          this.dates = [
            this.$moment(series[series.length - 1].x)
              .subtract(6, 'months')
              .format('YYYY-MM-DD'),
            this.$moment(series[series.length - 1].x).format('YYYY-MM-DD'),
          ]
          break
        case '1y':
          this.dates = [
            this.$moment(series[series.length - 1].x)
              .subtract(1, 'years')
              .format('YYYY-MM-DD'),
            this.$moment(series[series.length - 1].x).format('YYYY-MM-DD'),
          ]
          break
        case '3y':
          this.dates = [
            this.$moment(series[series.length - 1].x)
              .subtract(3, 'years')
              .format('YYYY-MM-DD'),
            this.$moment(series[series.length - 1].x).format('YYYY-MM-DD'),
          ]
          break
        case 'all':
        default:
          this.dates = [
            this.$moment(series[0].x).format('YYYY-MM-DD'),
            this.$moment(series[series.length - 1].x).format('YYYY-MM-DD'),
          ]
          break
      }
    },
    findStampInSeries(from, to, series = []) {
      const checkStamp = (t, ms) => this.$moment(ms).isSameOrAfter(t, 'day')

      let startIdx = 0

      for (const { x: ms } of series) {
        if (checkStamp(from, ms)) {
          break
        }
        startIdx++
      }

      let endIdx = startIdx

      for (const { x: ms } of series.slice(startIdx)) {
        if (checkStamp(to, ms)) {
          break
        }
        endIdx++
      }
      return [startIdx, endIdx]
    },
  },
}
</script>
