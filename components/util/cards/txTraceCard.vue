<template>
  <v-card tile flat height="100%">
    <v-row class="pa-0" no-gutters justify="space-between">
      <v-col cols="12" lg="3" md="4" sm="4" xs="12">
        <v-treeview
          style="min-width: 240px"
          :active.sync="selected"
          activatable
          return-object
          hoverable
          color="primary"
          transition
          open-all
          :items="iTraces"
          item-children="calls"
          item-text="type"
          dense
        >
        </v-treeview>
      </v-col>
      <v-col
        style="min-width: 100px; max-width: 100%"
        class="flex-grow-1 flex-shrink-0"
      >
        <v-card-text v-if="selected.length > 0">
          <v-list dense>
            <spectrum-list-item
              title="From"
              tooltip="The sending party of the transaction (could be from a contract address)."
            >
              <template v-slot:subtitle>
                <nuxt-link
                  :to="{
                    name: 'account-address',
                    params: { address: selected[0].from },
                  }"
                >
                  {{ selected[0].from }}
                </nuxt-link>
                {{ getAddressTag(selected[0].from) }}
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Interacted With (To)"
              tooltip="The receiving party of the transaction (could be a contract address)."
            >
              <template v-slot:subtitle>
                <nuxt-link
                  :to="{
                    name: 'account-address',
                    params: { address: selected[0].to },
                  }"
                >
                  {{ selected[0].to }}
                </nuxt-link>
                {{ getAddressTag(selected[0].to) }}
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Value"
              tooltip="The value being transacted in UBQ and fiat value."
            >
              <template v-slot:subtitle>
                {{ fromWei(selected[0].value) }} UBQ (${{
                  calcValue(fromWei(selected[0].value), 3)
                }})
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Gas"
              tooltip="Maximum amount of gas provided for the operation."
            >
              <template v-slot:subtitle>
                {{ formatNumber(selected[0].gas) }}
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Gas Used"
              tooltip="The exact units of gas that was used for the operation."
            >
              <template v-slot:subtitle>
                {{ formatNumber(selected[0].gasUsed) }}
              </template>
            </spectrum-list-item>
          </v-list>
          <input-data-card
            v-if="selected[0].input"
            :input-string="selected[0].input"
          />
          <input-data-card
            v-if="selected[0].output"
            :input-string="selected[0].output"
            output
          />
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import SpectrumListItem from '~/components/util/misc/ListItem.vue'
import addresses from '~/scripts/addresses'
import common from '~/scripts/common'
import inputDataCard from '~/components/util/cards/inputDataCard.vue'

export default {
  components: {
    SpectrumListItem,
    inputDataCard,
  },
  props: {
    traces: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data: () => ({
    selected: [],
    iTraces: [],
  }),
  computed: {
    priceUSD() {
      return this.$store.state.prices.ubq.usd
    },
  },
  created() {
    const traces = this.traces
    let count = 0
    // we need to add id to calls for treeview
    for (let t = 0; t < traces.length; t++) {
      if (traces[t]) {
        traces[t].id = count
        count++
        const deepcalls = function (calls) {
          for (let c = 0; c < calls.length; c++) {
            if (calls[c]) {
              calls[c].id = count
              count++
              if (calls[c].calls) {
                deepcalls(calls[c].calls)
              }
            }
          }
        }
        if (traces[t].calls) {
          deepcalls(traces[t].calls)
        }
      }
    }
    this.iTraces = traces
    this.selected = [this.iTraces[0]]
  },
  methods: {
    getAddressTag(hash) {
      const tag = addresses.getAddressTag(hash)
      if (tag) {
        return '(' + tag + ')'
      } else {
        return ''
      }
    },
    fromWei(val, roundTo) {
      return common.fromWei(val, roundTo)
    },
    calcValue(ubq, decimals) {
      return common.mulFiat(ubq, this.priceUSD, decimals)
    },
    formatNumber(val) {
      if (val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return ''
      }
    },
  },
}
</script>
