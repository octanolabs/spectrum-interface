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
        <span v-if="pending" style="margin:15px 15px 5px 15px;"
          >Showing {{ formatNumber(items.length) }} pending txns</span
        >
        <span v-else-if="block" style="margin:15px 15px 5px 15px;"
          >Showing {{ formatNumber(items.length) }} txns from block
          {{ blockNumber }}</span
        >
        <span v-else style="margin:15px 15px 5px 15px;"
          >Latest {{ formatNumber(items.length) }} txns from a total of
          {{ formatNumber(total) }} transactions</span
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
          <div slot="blockNumber" slot-scope="data">
            <span v-if="pending">pending</span>
            <nuxt-link
              v-else
              :to="{ name: 'Block', params: { number: data.value } }"
              >{{ data.value }}</nuxt-link
            >
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
            {{ fromWei(data.value) }} UBQ
          </div>
          <div slot="fee" slot-scope="data">
            <span v-if="pending">-</span>
            <span v-else
              >{{ calcTxFee(data.item.gasUsed, data.item.gasPrice) }} UBQ</span
            >
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
    pending: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    blockNumber: {
      type: Number,
      default: 0
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
        blockNumber: {
          label: 'Block'
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
        fee: {
          label: 'TxFee'
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
    calcTxFee(gasUsed, gasPrice) {
      return common.fromWei(common.calcTxFee(gasUsed, gasPrice))
    },
    formatNumber(val) {
      return common.formatNumber(val)
    }
  }
}
</script>
