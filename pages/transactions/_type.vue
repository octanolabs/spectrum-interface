<template>
  <v-row justify="center">
    <v-col cols="10">
      <ubiq-table
        :items="tableData"
        :headers="headers"
        :loading="loading"
        @refresh="refresh"
        item-key="number"
      >
        <template v-slot:hash="data">
          <nuxt-link :to="{ name: 'Transaction', params: { hash: data.value } }"
            >{{ data.value.substring(0, 17) }}...</nuxt-link
          >
        </template>
        <template v-slot:blockNumber="data">
          <span v-if="pending">pending</span>
          <nuxt-link
            v-else
            :to="{ name: 'Block', params: { number: data.value } }"
            >{{ data.value }}</nuxt-link
          >
        </template>
        <template v-slot:from="data">
          <nuxt-link :to="{ name: 'Address', params: { hash: data.value } }">{{
            getAddressTag(data.value)
          }}</nuxt-link
          ><span class="fa fa-arrow-right pull-right" />
        </template>
        <template v-slot:to="data">
          <nuxt-link :to="{ name: 'Address', params: { hash: data.value } }">{{
            getAddressTag(data.value)
          }}</nuxt-link>
        </template>
        <template v-slot:value="data"> {{ fromWei(data.value) }} UBQ </template>
        <template v-slot:fee="data">
          <span v-if="this.$route.params.type === 'pending'">-</span>
          <span v-else
            >{{ calcTxFee(data.item.gasUsed, data.item.gasPrice) }} UBQ</span
          >
        </template>
      </ubiq-table>
    </v-col>
  </v-row>
</template>

<script>
import ubiqTable from '~/components/UbiqTable.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  name: 'Transactions',
  components: {
    ubiqTable
  },
  validate({ params }) {
    const { type, number } = params
    if (type === 'latest' || type === 'pending') {
      return true
    } else if (type === 'block') {
      return /^\d+$/.test(number)
    }
  },
  data() {
    return {
      loading: false,
      headers: [
        {
          text: 'TxHash',
          value: 'hash',
          sortable: false
        },
        {
          text: 'Block',
          value: 'blockNumber',
          sortable: false
        },
        {
          text: 'From',
          value: 'from',
          sortable: false
        },
        {
          text: 'To',
          value: 'to',
          sortable: false
        },
        {
          text: 'Value',
          value: 'value',
          sortable: false
        },
        {
          text: 'TxFee',
          value: 'fee',
          sortable: false
        }
      ]
    }
  },
  computed: {
    transactionStore() {
      return this.$store.state.transactions
    },
    tableData() {
      return this.transactionStore[this.$route.params.type]
    }
  },
  async fetch({ store, params }) {
    const { type, number } = params
    switch (type) {
      case 'latest':
        await store.dispatch('transactions/fetchLatest')
        break
      case 'pending':
        await store.dispatch('transactions/fetchPending')
        break
      case 'block':
        store.commit('SET_BLOCKNUMBER', number)
        await store.dispatch('transactions/fetchTxsInBlock')
        break
      default:
        break
    }
  },
  created() {
    console.log('HERE this', this.$route.params.type)
    setTimeout(() => {
      this.refresh()
    }, 60000)
  },
  methods: {
    async refresh() {
      this.loading = true
      await this.$store.dispatch('transactions/fetchLatest')
      this.loading = false
    },
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
  // watch: {
  //   $route: {
  //     handler(from, to) {
  //       this.fetch()
  //     },
  //     immediate: true
  //   }
  // }
}
</script>

<!--<template>-->
<!--  <div>-->
<!--    <v-row class="justify-content-md-center">-->
<!--      <v-col md="10">-->
<!--        <v-breadcrumbs>-->
<!--          <v-breadcrumbs-item :to="{ name: 'Home' }">Home</v-breadcrumbs-item>-->
<!--          <v-breadcrumbs-item-->
<!--            :active="type === 'latest'"-->
<!--            :to="{ name: 'Transactions', params: { type: 'latest' } }"-->
<!--            >Transactions</v-breadcrumbs-item-->
<!--          >-->
<!--          <v-breadcrumbs-item v-if="type === 'pending'" active-->
<!--            >Pending</v-breadcrumbs-item-->
<!--          >-->
<!--          <v-breadcrumbs-item v-else-if="type === 'block'" active-->
<!--            >Block {{ blockNumber }}</v-breadcrumbs-item-->
<!--          >-->
<!--          <v-breadcrumbs-link>-->
<!--            <b-button-->
<!--              :class="{-->
<!--                fa: true,-->
<!--                'fa-refresh': true,-->
<!--                'fa-spin': refreshing,-->
<!--                'btn-breadcrumb': true-->
<!--              }"-->
<!--              v-on:click="fetch()"-->
<!--            />-->
<!--          </v-breadcrumbs-link>-->
<!--        </v-breadcrumbs>-->
<!--        <TxnsTable-->
<!--          :items="txns"-->
<!--          :pending="type === 'pending'"-->
<!--          :block="type === 'block'"-->
<!--          :blockNumber="Number(blockNumber)"-->
<!--          :total="total"-->
<!--        />-->
<!--      </v-col>-->
<!--    </v-row>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import axios from 'axios'-->
<!--import TxnsTable from '~/components/tables/Txns.vue'-->

<!--export default {-->
<!--  name: 'Transactions',-->
<!--  components: {-->
<!--    TxnsTable-->
<!--  },-->
<!--  props: {-->
<!--    type: {-->
<!--      type: String,-->
<!--      default: () => {-->
<!--        return ''-->
<!--      }-->
<!--    },-->
<!--    blockNumber: {-->
<!--      type: Number,-->
<!--      default: () => {-->
<!--        return 0-->
<!--      }-->
<!--    }-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      refreshing: false,-->
<!--      txns: [],-->
<!--      total: 0,-->
<!--      errors: []-->
<!--    }-->
<!--  },-->
<!--  watch: {-->
<!--    $route: {-->
<!--      handler(from, to) {-->
<!--        this.fetch()-->
<!--      },-->
<!--      immediate: true-->
<!--    },-->
<!--    type() {-->
<!--      this.fetch()-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    fetch() {-->
<!--      this.refreshing = true-->
<!--      const self = this-->
<!--      if (this.type === 'latest') {-->
<!--        axios-->
<!--          .get(this.$store.state.api + 'latesttransactions/1000')-->
<!--          .then((response) => {-->
<!--            this.txns = response.data.txns-->
<!--            this.total = response.data.total-->
<!--            setTimeout(function() {-->
<!--              self.refreshing = false-->
<!--            }, 2000)-->
<!--          })-->
<!--          .catch((e) => {-->
<!--            this.errors.push(e)-->
<!--          })-->
<!--      } else if (this.type === 'block') {-->
<!--        axios-->
<!--          .get(this.$store.state.api + `block/${this.blockNumber}/txns`)-->
<!--          .then((response) => {-->
<!--            this.txns = response.data-->
<!--            setTimeout(function() {-->
<!--              self.refreshing = false-->
<!--            }, 2000)-->
<!--          })-->
<!--          .catch((e) => {-->
<!--            this.errors.push(e)-->
<!--          })-->
<!--      } else {-->
<!--        // pending transactions-->
<!--        axios-->
<!--          .post(this.$store.state.rpc, {-->
<!--            jsonrpc: '2.0',-->
<!--            method: 'eth_getBlockByNumber',-->
<!--            params: ['pending', true],-->
<!--            id: 1-->
<!--          })-->
<!--          .then((response) => {-->
<!--            this.txns = response.data.result.transactions-->
<!--            setTimeout(function() {-->
<!--              self.refreshing = false-->
<!--            }, 2000)-->
<!--          })-->
<!--          .catch((e) => {-->
<!--            this.errors.push(e)-->
<!--          })-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
