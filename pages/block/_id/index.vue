<template>
  <v-row justify="center">
    <v-col lg="8" md="10" sm="12">
      <blockPage
        :latest-block="this.$store.state.stats.latestBlock"
        :block="block"
        :transactions="transactions"
        :open-transactions="openTransactions"
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
    let method = ''

    if (/^\d+$/.test(this.$route.params.id)) {
      method = `/block/`
    } else {
      method = `/blockbyhash/`
    }

    const { data } = await axios
      .get(process.env.config.apiUrl + method + this.$route.params.id)
      .then((response) => {
        this.block = response.data

        return axios.get(
          process.env.config.apiUrl + `/block/${response.data.number}/txns`
        )
      })

    this.transactions = data
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
  fetchOnServer: false,
  middleware({ store }) {
    store.dispatch('fetchIndexState')
  }
}
</script>
