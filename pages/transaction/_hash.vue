<template>
  <v-row justify="center">
    <v-col lg="8" md="10" sm="12">
      <transaction-page
        :transaction="txn"
        :price-usd="priceUSD"
        :confirmations="confirmations"
      ></transaction-page>
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
  props: {
    hash: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  async middleware({ store }) {
    await store.dispatch('fetchPrices')
  },
  async fetch() {
    const { data } = await axios.get(
      process.env.config.apiUrl + `/transaction/${this.$route.params.hash}`
    )
    this.txn = data
  },
  data() {
    return {
      txn: {},
      contractDeployed: false,
      refreshing: false,

      notfound: false,
      showLogs: false,
      eventLogs: [],
      timestamp: '',
      pending: false,
      errors: []
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
      return this.$store.state.prices.usd
    }
  },
  // watch: {
  //   latestBlock() {
  //     if (this.pending === true) {
  //       this.$fetch()
  //     } else {
  //       this.timestamp = this.calcTime(this.txn.timestamp)
  //     }
  //   }
  // },
  methods: {
    // fetch() {
    //   this.refreshing = true
    //   axios
    //     .get(this.$store.state.api + 'transaction/' + this.hash)
    //     .then((response) => {
    //       if (response.data.hash) {
    //         this.txn = response.data
    //         this.timestamp = this.calcTime(this.txn.timestamp)
    //         if (response.data.logs.length > 0) {
    //           this.showLogs = true
    //           this.eventLogs = contracts.processEventLogs(this.txn.logs)
    //         }
    //         this.pending = false
    //       } else {
    //         axios
    //           .post(this.$store.state.rpc, {
    //             jsonrpc: '2.0',
    //             method: 'eth_getTransactionByHash',
    //             params: [this.hash],
    //             id: 1
    //           })
    //           .then((response_) => {
    //             if (response_.data.result) {
    //               this.txn = response_.data.result
    //               this.pending = true
    //             } else {
    //               this.notfound = true
    //             }
    //           })
    //           .catch((e) => {
    //             this.errors.push(e)
    //           })
    //       }
    //       if (this.txn.input !== '0x') {
    //         this.inputData = contracts.processTxnInput(this.txn.input)
    //         if (this.inputData.isKnown === true) {
    //           this.inputType = 'default'
    //         }
    //         this.token = tokens.processInputData(this.txn, this.inputData)
    //         if (this.token.isTokenTxn) {
    //           this.tokenTransfered = true
    //         }
    //       }
    //     })
    //     .catch((e) => {
    //       this.errors.push(e)
    //     })
    //
    //   const self = this
    //   setTimeout(function() {
    //     self.refreshing = false
    //   }, 2000)
    // }
  }
}
</script>
