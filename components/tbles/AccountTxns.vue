<template>
  <v-row>
    <v-col md="12">
      <b-table
        :items="items"
        :fields="fields"
        class="mb-0"
        responsive="sm"
        hover
        stacked="sm"
      >
        <div slot="hash" slot-scope="data">
          <nuxt-link :to="{ name: 'Transaction', params: { hash: data.value } }"
            >{{ data.value.substring(0, 17) }}...</nuxt-link
          >
        </div>
        <div slot="blockNumber" slot-scope="data">
          <nuxt-link :to="{ name: 'Block', params: { number: data.value } }">{{
            data.value
          }}</nuxt-link>
        </div>
        <div slot="timestamp" slot-scope="data">
          ~{{ calcTime(data.value) }}
        </div>
        <div slot="from" slot-scope="data">
          <nuxt-link :to="{ name: 'Address', params: { hash: data.value } }">{{
            getAddressTag(data.value)
          }}</nuxt-link
          ><v-badge v-if="address === data.value" class="tx-badge pull-right"
            >OUT</v-badge
          ><v-badge v-else class="tx-badge pull-right">IN</v-badge>
        </div>
        <div slot="to" slot-scope="data">
          <nuxt-link :to="{ name: 'Address', params: { hash: data.value } }">{{
            getAddressTag(data.value)
          }}</nuxt-link>
        </div>
        <div slot="value" slot-scope="data">{{ fromWei(data.value) }} UBQ</div>
        <div slot="txFee" slot-scope="data">
          {{ calcTxFee(data.item.gasUsed, data.item.gasPrice) }} UBQ
        </div>
      </b-table>
    </v-col>
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
    address: {
      type: String
    }
  },
  data: () => {
    return {
      fields: {
        hash: {
          label: 'TxHash'
        },
        blockNumber: {
          label: 'Block'
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
        txFee: {
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
    calcTime(timestamp) {
      return this.$moment().to(timestamp * 1000)
    },
    calcTxFee(gasUsed, gasPrice) {
      return common.fromWei(common.calcTxFee(gasUsed, gasPrice))
    }
  }
}
</script>
