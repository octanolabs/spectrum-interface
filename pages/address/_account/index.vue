<template>
  <v-col cols="12" class="pa-0">
    <breadcrumbSpinner v-bind="$attrs" no-loading />
    <token-page
      v-if="isToken"
      :store="accountStore"
      :price="tokenPrice"
      :address="$route.params.account"
      :loading-object="fetchStates"
      @refresh="$fetch"
    />

    <account-page
      v-else
      :store="accountStore"
      :price="ubqPrice"
      :address="$route.params.account"
      :loading-object="fetchStates"
      @refresh="$fetch"
    />
  </v-col>
</template>

<!-- Todo: Default token balance view should only show echer balance, optional button to load all other token balances-->
<!-- maybe it should be a small card component with balance + sparkline of n months of balance-->

<script>
import tokens from '../../../scripts/tokens'
import accountPage from '~/components/page/accountPage.vue'
import tokenPage from '~/components/page/tokenPage.vue'
import BreadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'

export default {
  name: 'Account',
  components: {
    accountPage,
    tokenPage,
    BreadcrumbSpinner,
  },
  async middleware({ store }) {
    await store.dispatch('fetchStats')
    await store.dispatch('tokens/getDefaultTokens')
    await store.dispatch('tokens/getShinobiTokens')
    await store.dispatch('tokens/getShinobiPairs')
  },
  fetch() {
    const address = this.$route.params.account.toLowerCase()
    this.isToken = Object.keys(tokens).includes(address)

    if (this.isToken) {
      this.setToken(address)
      this.fetchTokenSupply(address)
      this.fetchTransfersOfToken(address)
      this.fetchContractData(address)
    } else {
      this.fetchBalance(address)
      this.fetchTransactions(address)
      this.fetchMinedBlocks(address)
      this.fetchTokenTransfers(address)
      this.fetchContractData(address)
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
        mined: false,
        isToken: false,
      },
    }
  },
  computed: {
    accountStore() {
      return this.$store.state.account
    },
    tokens() {
      return this.$store.state.tokens.erc20
    },
    ubqPrice() {
      return this.$store.state.tokens.ubqPrice
    },
  },
  watch: {
    '$route.params.account': {
      handler() {
        this.$store.dispatch('account/clearState')
        this.$fetch()
      },
      immediate: true,
    },
  },

  validate({ params }) {
    return /^0x([A-Fa-f0-9]{40})$/.test(params.account)
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
    async fetchMinedBlocks(address) {
      this.fetchStates.mined = true
      await this.$store.dispatch('account/fetchMinedBlocks', address)
      this.fetchStates.mined = false
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
  },
}
</script>
