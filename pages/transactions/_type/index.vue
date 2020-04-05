<template>
  <v-row justify="center">
    <v-col cols="10">
      <template v-if="type === 'latest'">
        <txnsTable
          :loading="$fetchState.pending"
          :transactions="txStore.latest"
          :total="txStore.total"
          @refresh="$fetch"
        />
      </template>
      <template v-else>
        <txnsTable
          :loading="$fetchState.pending"
          :transactions="txStore.pending"
          pending
          @refresh="$fetch"
        />
      </template>
    </v-col>
  </v-row>
</template>

<script>
import txnsTable from '~/components/tables/txnsTable.vue'

export default {
  name: 'Transactions',
  components: {
    txnsTable
  },
  validate({ params }) {
    if (params.type === 'latest' || params.type === 'pending') {
      return true
    }
  },
  async fetch() {
    switch (this.$route.params.type) {
      case 'latest':
        await this.$store.dispatch('transactions/fetchLatest')
        break
      case 'pending':
        await this.$store.dispatch('transactions/fetchPending')
        break
    }
  },
  computed: {
    txStore() {
      return this.$store.state.transactions
    },
    type() {
      return this.$route.params.type
    }
  },
  created() {
    setTimeout(() => {
      this.$fetch()
    }, 60000)
  }
}
</script>
