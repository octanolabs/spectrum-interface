<template>
  <v-row justify="center">
    <v-col cols="10">
      <token-page
        v-if="isToken"
        :store="accountStore"
        :price="tokenPrice"
        :address="$route.params.address"
        :loading-object="fetchStates"
        @refresh="$fetch"
      />

      <account-page
        v-else
        :store="accountStore"
        :price="prices.ubq"
        :address="$route.params.address"
        :loading-object="fetchStates"
        @refresh="$fetch"
      />
    </v-col>
  </v-row>
</template>

<!-- Todo: Default token balance view should only show echer balance, optional button to load all other token balances-->
<!-- maybe it should be a small card component with balance + sparkline of n months of balance-->

<script>
import tokens from '../../../scripts/tokens'
import accountPage from '~/components/page/accountPage.vue'
import tokenPage from '~/components/page/tokenPage.vue'

export default {
  name: 'Account',
  components: {
    accountPage,
    tokenPage,
  },
  fetch() {
    const address = this.$route.params.address.toLowerCase()
    const isToken = Object.keys(tokens.getTokens()).includes(address)

    if (isToken) {
      this.setToken(address)
      this.fetchTokenSupply(address)
      this.fetchTransfersOfToken(address)
      this.fetchContractData(address)
    } else {
      this.fetchBalance(address)
      this.fetchTransactions(address)
      this.fetchTokenTransfers(address)
      this.fetchContractData(address)
      this.fetchTokenBalances(address)
    }
  },
  data() {
    return {
      fetchStates: {
        balance: false,
        tokenBalances: false,
        transactions: false,
        tokenTransfers: false,
        contractData: false,
      },
    }
  },
  computed: {
    accountStore() {
      return this.$store.state.account
    },
    prices() {
      return this.$store.state.prices
    },
    isToken() {
      const address = this.$route.params.address.toLowerCase()
      return Object.keys(tokens.getTokens()).includes(address)
    },
    tokenPrice() {
      const address = this.$route.params.address.toLowerCase()
      const tk = tokens.getToken(address)

      if (tk.traded) {
        return this.prices[tk.symbol.toLowerCase()]
      }
      return null
    },
  },
  watch: {
    '$route.params.address': {
      handler() {
        this.$fetch()
      },
      immediate: true,
    },
  },

  validate({ params }) {
    return /^0x([A-Fa-f0-9]{40})$/.test(params.address)
  },
  async middleware({ store }) {
    await store.dispatch('fetchPrices')
  },
  methods: {
    async setToken(address) {
      await this.$store.dispatch('account/setToken', address)
    },
    async fetchTokenSupply(address) {
      this.fetchStates.balance = true
      await this.$store.dispatch('account/fetchTokenSupply', address)
      this.fetchStates.balance = false
    },
    async fetchTransfersOfToken(address) {
      this.fetchStates.tokenTransfers = true
      await this.$store.dispatch('account/fetchTransfersOfToken', address)
      this.fetchStates.tokenTransfers = false
    },
    //
    async fetchBalance(address) {
      this.fetchStates.balance = true
      await this.$store.dispatch('account/fetchBalance', address)
      this.fetchStates.balance = false
    },
    async fetchTransactions(address) {
      this.fetchStates.transactions = true
      await this.$store.dispatch('account/fetchTransactions', address)
      this.fetchStates.transactions = false
    },
    async fetchTokenTransfers(address) {
      this.fetchStates.tokenTransfers = true
      await this.$store.dispatch('account/fetchTokenTransfers', address)
      this.fetchStates.tokenTransfers = false
    },
    async fetchContractData(address) {
      this.fetchStates.contractData = true
      await this.$store.dispatch('account/fetchContractData', address)
      this.fetchStates.contractData = false
    },
    async fetchTokenBalances(address) {
      this.fetchStates.tokenBalances = true
      await this.$store.dispatch('account/fetchTokenBalances', address)
      this.fetchStates.tokenBalances = false
    },
  },
}
</script>
