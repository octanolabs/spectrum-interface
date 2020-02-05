<template>
  <div>
    <v-row class="justify-content-md-center">
      <v-col md="10">
        <v-breadcrumbs>
          <v-breadcrumbs-item :to="{ name: 'Home' }">Home</v-breadcrumbs-item>
          <v-breadcrumbs-item
            :active="type === 'latest'"
            :to="{ name: 'Transactions', params: { type: 'latest' } }"
            >Transactions</v-breadcrumbs-item
          >
          <v-breadcrumbs-item v-if="type === 'pending'" active
            >Pending</v-breadcrumbs-item
          >
          <v-breadcrumbs-item v-else-if="type === 'block'" active
            >Block {{ blockNumber }}</v-breadcrumbs-item
          >
          <v-breadcrumbs-link>
            <b-button
              :class="{
                fa: true,
                'fa-refresh': true,
                'fa-spin': refreshing,
                'btn-breadcrumb': true
              }"
              v-on:click="fetch()"
            ></b-button>
          </v-breadcrumbs-link>
        </v-breadcrumbs>
        <TxnsTable
          :items="txns"
          :pending="type === 'pending'"
          :block="type === 'block'"
          :blockNumber="Number(blockNumber)"
          :total="total"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import TxnsTable from '~/components/tables/Txns.vue'

export default {
  name: 'Transactions',
  components: {
    TxnsTable
  },
  props: {
    type: {
      type: String,
      default: () => {
        return ''
      }
    },
    blockNumber: {
      type: Number,
      default: () => {
        return 0
      }
    }
  },
  data() {
    return {
      refreshing: false,
      txns: [],
      total: 0,
      errors: []
    }
  },
  watch: {
    $route: {
      handler(from, to) {
        this.fetch()
      },
      immediate: true
    },
    type() {
      this.fetch()
    }
  },
  methods: {
    fetch() {
      this.refreshing = true
      const self = this
      if (this.type === 'latest') {
        axios
          .get(this.$store.state.api + 'latesttransactions/1000')
          .then((response) => {
            this.txns = response.data.txns
            this.total = response.data.total
            setTimeout(function() {
              self.refreshing = false
            }, 2000)
          })
          .catch((e) => {
            this.errors.push(e)
          })
      } else if (this.type === 'block') {
        axios
          .get(this.$store.state.api + `block/${this.blockNumber}/txns`)
          .then((response) => {
            this.txns = response.data
            setTimeout(function() {
              self.refreshing = false
            }, 2000)
          })
          .catch((e) => {
            this.errors.push(e)
          })
      } else {
        // pending transactions
        axios
          .post(this.$store.state.rpc, {
            jsonrpc: '2.0',
            method: 'eth_getBlockByNumber',
            params: ['pending', true],
            id: 1
          })
          .then((response) => {
            this.txns = response.data.result.transactions
            setTimeout(function() {
              self.refreshing = false
            }, 2000)
          })
          .catch((e) => {
            this.errors.push(e)
          })
      }
    }
  }
}
</script>
