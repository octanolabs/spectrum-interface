<template>
  <v-row>
    <b-col md="12">
      <b-card no-body>
        <b-table
          :items="items"
          :fields="fields"
          class="mb-0"
          responsive="sm"
          stacked="sm"
          hover
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
            ><b-badge
              v-if="address === data.value && badge === true"
              class="tx-badge pull-right"
              >OUT</b-badge
            ><b-badge
              v-else-if="address !== data.value && badge === true"
              class="tx-badge pull-right"
              >IN</b-badge
            >
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
    </b-col>
  </v-row>
</template>

<script>
// import common from '../../scripts/common'
import addresses from '../../scripts/addresses'
import tokens from '../../scripts/tokens'
export default {
  props: {
    items: {
      type: Array
    },
    address: {
      type: String
    },
    badge: {
      type: Boolean,
      default: true
    }
  },
  data: () => {
    return {
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
    }
  }
}
</script>
