<template>
  <v-row justify="center">
    <v-col lg="8" md="10" sm="12">
      <transaction-page
        :transaction="txn"
        :price-usd="priceUSD"
        :confirmations="confirmations"
      />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'

import transactionPage from '~/components/page/transactionPage.vue'

export default {
  name: 'Transaction',
  components: {
    transactionPage
  },
  async middleware({ store }) {
    await store.dispatch('fetchPrices')
    await store.dispatch('fetchStats')
  },
  async fetch() {
    const {
      data: { result }
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_transactionByHash',
      params: [this.$route.params.hash],
      id: 88
    })
    this.txn = result
  },
  data() {
    return {
      txn: {}
    }
  },
  computed: {
    confirmations() {
      return this.pending === true
        ? 0
        : this.$store.state.stats.latestBlock.number - this.txn.blockNumber
    },
    latestBlock() {
      return this.$store.state.stats.latestBlock.number
    },
    priceUSD() {
      return this.$store.state.prices.ubq.usd
    }
  }
}
</script>
