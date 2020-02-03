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
          >Latest {{ formatNumber(items.length) }} txns from a total of
          {{ formatNumber(total) }} token transfers</span
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
          <div slot="hash" slot-scope="data">
            <nuxt-link
              :to="{ name: 'Transaction', params: { hash: data.value } }"
              >{{ data.value.substring(0, 17) }}...</nuxt-link
            >
          </div>
          <div slot="timestamp" slot-scope="data">
            ~{{ calcTime(data.value) }}
          </div>
          <div slot="from" slot-scope="data">
            <nuxt-link
              :to="{ name: 'Address', params: { hash: data.value } }"
              >{{ getAddressTag(data.value) }}</nuxt-link
            ><span class="fa fa-arrow-right pull-right" />
          </div>
          <div slot="to" slot-scope="data">
            <nuxt-link
              :to="{ name: 'Address', params: { hash: data.value } }"
              >{{ getAddressTag(data.value) }}</nuxt-link
            >
          </div>
          <div slot="value" slot-scope="data">
            {{ formatValue(data.value, data.item.contract) }}
          </div>
          <div slot="contract" slot-scope="data">
            {{ getName(data.value) }}
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
import tokens from '../../scripts/tokens'
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
        hash: {
          label: 'TxHash'
        },
        timestamp: {
          label: 'Age'
        },
        from: {
          label: 'From'
        },
        to: {
          label: 'To'
        },
        value: {
          label: 'Value'
        },
        contract: {
          label: 'Token'
        }
      }
    }
  },
  methods: {
    getRowCount(items) {
      return items.length
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash.substring(0, 17) + '...'
    },
    calcTime(timestamp) {
      return this.$moment().to(timestamp * 1000)
    },
    formatValue(val, contract) {
      return tokens.formatValue(val, contract)
    },
    getName(contract) {
      return tokens.getName(contract)
    },
    formatNumber(val) {
      return common.formatNumber(val)
    }
  }
}
</script>
