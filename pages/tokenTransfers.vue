<template>
  <v-row justify="center">
    <v-col cols="12">
      <transfers-table
        :loading="$fetchState.pending"
        :transfers="transfersStore.latest"
        :total="transfersStore.total"
        @refresh="$fetch"
      />
    </v-col>
  </v-row>
</template>

<script>
import transfersTable from '~/components/tables/tokenTransfersTable.vue'

export default {
  name: 'TokenTransfers',
  components: {
    transfersTable,
  },
  async fetch() {
    await this.$store.dispatch('tokentransfers/fetchLatest')
  },
  async middleware({ store }) {
    await store.dispatch('fetchStats')
    await store.dispatch('tokens/getDefaultTokens')
    await store.dispatch('tokens/getShinobiTokens')
    await store.dispatch('tokens/getShinobiPairs')
  },
  computed: {
    transfersStore() {
      return this.$store.state.tokentransfers
    },
  },
  created() {
    setTimeout(() => {
      this.$fetch()
    }, 60000)
  },
}
</script>
