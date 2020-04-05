<template>
  <v-row justify="center">
    <v-col cols="10">
      <txns-table
        :transactions="transactions"
        block
        :block-number="blockNumber"
        :total="transactions.length"
      />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import txnsTable from '~/components/tables/txnsTable.vue'

export default {
  name: 'Transactions',
  components: {
    txnsTable
  },
  validate({ params }) {
    if (/^\d+$/.test(params.id) || /^0x([A-Fa-f0-9]{64})$/.test(params.id)) {
      if (params.action === 'transactions') {
        return true
      }
    }
    return false
  },
  async fetch() {
    let method = ''

    if (/^\d+$/.test(this.$route.params.id)) {
      method = `/block/`
    } else {
      method = `/blockbyhash/`
    }

    const { data: transactions } = await axios
      .get(process.env.config.apiUrl + method + this.$route.params.id)
      .then((response) => {
        // If we use this const declaration the second get request is not done...
        // TODO: Eventually switch to nuxt's own http module
        // const {
        //   data: {
        //     block: { number }
        //   }
        // } = response

        this.blockNumber = response.data.number
        return axios.get(
          process.env.config.apiUrl + `/block/${response.data.number}/txns`
        )
      })

    this.transactions = transactions
  },
  data() {
    return {
      blockNumber: 0,
      transactions: []
    }
  },
  fetchOnServer: false,
  middleware({ store }) {
    store.dispatch('fetchIndexState')
  }
}
</script>
