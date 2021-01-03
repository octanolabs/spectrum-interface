<template>
  <v-row justify="center">
    <v-col cols="12">
      <transaction-page
        :transaction="txn"
        :trace="txnTrace"
        :price-usd="priceUSD"
        :confirmations="confirmations"
        :contract-deployed="contractDeployed"
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
    transactionPage,
  },
  async middleware({ store }) {
    await store.dispatch('fetchPrices')
    await store.dispatch('fetchStats')
  },
  async fetch() {
    const [
      {
        data: { result: txn },
      },
      {
        data: { result: trace },
      },
    ] = await Promise.all([
      axios.post(process.env.config.apiUrl, {
        jsonrpc: '2.0',
        method: 'explorer_transactionByHash',
        params: [this.$route.params.hash],
        id: 88,
      }),
      axios.post(process.env.config.apiUrl, {
        jsonrpc: '2.0',
        method: 'explorer_txTrace',
        params: [this.$route.params.hash],
        id: 88,
      }),
    ])
    this.txn = txn
    this.txnTrace = trace
  },
  data() {
    return {
      txn: {},
      txnTrace: {},
    }
  },
  computed: {
    contractDeployed() {
      return this.txn.to === '' && !!this.txn.contractAddress
    },
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
    },
  },
  watch: {
    $route() {
      this.$fetch()
    },
  },
}
</script>
