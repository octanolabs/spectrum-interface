<template>
  <v-col cols="12" class="pa-0">
    <txnsTable
      v-if="type === 'pending'"
      no-breadcrumbs
      :loading="$fetchState.pending"
      :transactions="txStore.pending"
      :total="txStore.total"
      pending
      @refresh="$fetch"
    />
    <txnsTable
      v-else-if="type === 'failed'"
      no-breadcrumbs
      :loading="$fetchState.pending"
      :transactions="txStore.failed"
      :total="txStore.total"
      @refresh="$fetch"
    />
    <txnsTable
      v-else-if="type === 'contracts'"
      no-breadcrumbs
      :loading="$fetchState.pending"
      :transactions="txStore.contracts"
      :total="txStore.total"
      deploys-contracts
      @refresh="$fetch"
    />
    <txnsTable
      v-else-if="type === 'calls'"
      no-breadcrumbs
      :loading="$fetchState.pending"
      :transactions="txStore.calls"
      :total="txStore.total"
      @refresh="$fetch"
    />
    <txnsTable
      v-else
      no-breadcrumbs
      :loading="$fetchState.pending"
      :transactions="txStore.latest"
      :total="txStore.total"
      @refresh="$fetch"
    />
  </v-col>
</template>

<router>
  path: /transactions/:type?
</router>

<!--{-->
<!--alias: [-->
<!--{-->
<!--path: '/latest',-->
<!--props: {-->
<!--section: 'latest'-->
<!--}-->
<!--},-->
<!--{-->
<!--path: '/pending',-->
<!--props: {-->
<!--section: 'pending'-->
<!--}-->
<!--}-->
<!--]-->
<!--}<script>-->

<script>
import txnsTable from '~/components/tables/txnsTable.vue'

export default {
  name: 'Transactions',
  components: {
    txnsTable,
  },
  // props: {
  //   section: {
  //     type: String,
  //     required: true,
  //     default: 'latest'
  //   }
  // },
  async fetch() {
    switch (this.$route.params.type) {
      case 'pending':
        await this.$store.dispatch('transactions/fetchPending')
        break
      case 'failed':
        await this.$store.dispatch('transactions/fetchFailed')
        break
      case 'contracts':
        await this.$store.dispatch('transactions/fetchContracts')
        break
      case 'calls':
        await this.$store.dispatch('transactions/fetchCalls')
        break
      case 'latest':
      default:
        await this.$store.dispatch('transactions/fetchLatest')
        break
    }
  },
  // validate({ query }) {
  //   if (query.latest || query.pending) {
  //     return true
  //   }
  // },
  computed: {
    txStore() {
      return this.$store.state.transactions
    },
    section() {
      return this.$route.params.section
    },
    type() {
      return this.$route.params.type
    },
  },
  watch: {
    '$route.params': {
      handler() {
        this.$fetch()
      },
    },
  },
  created() {
    setTimeout(() => {
      this.$fetch()
    }, 60000)
  },
}
</script>
