<template>
  <v-col cols="12" class="pa-0">
    <accounts-table
      :accounts="accounts"
      :price="price"
      :supply="supply"
      :total="totalAccounts"
    />
  </v-col>
</template>

<script>
import accountsTable from '~/components/tables/accountsTable'

export default {
  components: {
    accountsTable,
  },
  async middleware({ store }) {
    await store.dispatch('accounts/fetchByBalance')
  },
  computed: {
    accounts() {
      return this.$store.state.accounts.richlist
    },
    totalAccounts() {
      return this.$store.state.accounts.total
    },
    price() {
      return this.$store.state.tokens.ubqPrice
    },
    supply() {
      return this.$store.state.stats.supply || '0'
    },
  },
}
</script>
