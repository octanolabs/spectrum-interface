<template>
  <v-col cols="12" class="pa-0">
    <breadcrumbSpinner v-bind="$attrs" no-loading />
    <token-page
      v-if="isToken"
      :token="token"
      :store="accountStore"
      :address="$route.params.account"
      :loading-object="fetchStates"
      @refresh="$fetch()"
    />

    <account-page
      v-else
      :store="accountStore"
      :price="ubqPrice"
      :address="$route.params.account"
      :loading-object="fetchStates"
      @refresh="$fetch()"
    />
  </v-col>
</template>

<script>
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
    const tokens = this.$store.state.tokens.erc20
    const shinobi = this.$store.state.tokens.shinobi
    this.isToken = Object.keys(tokens).includes(address)
    this.isShinobi = Object.keys(shinobi).includes(address)
    let token = tokens[address]
    if (this.isToken) {
      if (this.isShinobi) {
        token = { ...shinobi[address], ...token }
      }
      this.token = token
      this.fetchTransfersOfToken(address)
      this.fetchContractData(address)
    } else {
      this.fetchBalance(address)
      this.fetchTransactions(address)
      this.fetchITransactions(address)
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
        internalTxns: false,
        tokenTransfers: false,
        contractData: false,
        mined: false,
        isToken: false,
        isShinobi: false,
        token: null,
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
    async fetchITransactions(address) {
      this.fetchStates.internalTxns = true
      await this.$store.dispatch('account/fetchITransactions', address)
      this.fetchStates.internalTxns = false
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
