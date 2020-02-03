<template>
  <v-row>
    <b-col md="12">
      <nav style="margin-right:-4px;">
        <b-pagination
          :total-rows="getRowCount(items)"
          :per-page="perPage"
          v-model="currentPage"
          size="md"
          align="right"
          prev-text="Prev"
          next-text="Next"
        />
      </nav>
      <b-card no-body>
        <span style="margin:15px 15px 5px 15px;"
          >Showing {{ formatNumber(items.length) }} from a total of
          {{ formatNumber(total) }} uncles</span
        >
        <hr />
        <b-table
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          class="mb-0"
          responsive="sm"
          hover
          stacked="sm"
        >
          <div slot="blockNumber" slot-scope="data">
            <nuxt-link
              :to="{ name: 'Block', params: { number: data.value } }"
              >{{ data.value }}</nuxt-link
            >
          </div>
          <div slot="number" slot-scope="data">
            <nuxt-link
              :to="{ name: 'Uncle', params: { hash: data.item.hash } }"
              >{{ data.value }}</nuxt-link
            >
          </div>
          <div slot="timestamp" slot-scope="data">
            ~{{ calcTime(data.value) }}
          </div>
          <div slot="miner" slot-scope="data">
            <nuxt-link
              :to="{ name: 'Address', params: { hash: data.value } }"
              >{{ getAddressTag(data.value) }}</nuxt-link
            >
          </div>
          <div slot="reward" slot-scope="data">
            {{ fromWei(data.value) }} UBQ
          </div>
        </b-table>
      </b-card>
      <nav style="margin-right:-4px;margin-top:15px;">
        <b-pagination
          :total-rows="getRowCount(items)"
          :per-page="perPage"
          v-model="currentPage"
          size="md"
          align="right"
          prev-text="Prev"
          next-text="Next"
        />
      </nav>
    </b-col>
  </v-row>
</template>

<script>
import common from '../../scripts/common'
import addresses from '../../scripts/addresses'
export default {
  props: {
    items: {
      type: Array
    },
    total: {
      type: Number
    }
  },
  data: () => {
    return {
      currentPage: 1,
      perPage: 25,
      totalRows: 0,
      fields: {
        blockNumber: {
          label: 'Block Height'
        },
        number: {
          label: 'Uncle Number'
        },
        timestamp: {
          label: 'Age'
        },
        miner: {
          label: 'Miner'
        },
        reward: {
          label: 'Reward'
        }
      }
    }
  },
  methods: {
    getRowCount(items) {
      return items.length
    },
    fromWei(value) {
      return common.fromWei(value)
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash.substring(0, 17) + '...'
    },
    calcTime(timestamp) {
      return this.$moment().to(timestamp * 1000)
    },
    formatNumber(val) {
      return common.formatNumber(val)
    }
  }
}
</script>
