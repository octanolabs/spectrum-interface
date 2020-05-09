<template>
  <v-row justify="center">
    <v-col lg="8" md="10" sm="12">
      <blockPage
        :latest-block="this.$store.state.stats.latestBlock"
        :block="block"
        :transactions="transactions"
        :open-transactions="openTransactions"
        :loading="$fetchState.pending"
      />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import blockPage from '~/components/page/blockPage.vue'

export default {
  name: 'Block',
  components: {
    blockPage
  },
  validate({ params }) {
    if (/^\d+$/.test(params.id)) {
      return true
    }
    return /^0x([A-Fa-f0-9]{64})$/.test(params.id)
  },
  async fetch() {
    let id = this.$route.params.id
    let method = ''

    if (/^\d+$/.test(id)) {
      method = `explorer_blockByNumber`
      id = parseInt(id, 10)
    } else {
      method = `explorer_blockByHash`
    }

    const {
      data: { result }
    } = await axios
      .post(process.env.config.apiUrl, {
        jsonrpc: '2.0',
        method,
        params: [id],
        id: 88
      })
      .then(({ data: { result: block } }) => {
        this.block = block

        return axios.post(process.env.config.apiUrl, {
          jsonrpc: '2.0',
          method: 'explorer_transactionsByBlockNumber',
          params: [id],
          id: 88
        })
      })

    this.transactions = result
  },
  data() {
    return {
      block: {},
      transactions: []
    }
  },
  computed: {
    openTransactions() {
      const query = this.$route.query
      if (query.show === 'transactions') {
        return true
      }
      return false
    }
  },
  middleware({ store }) {
    store.dispatch('fetchStats')
  }
}
</script>
