<template>
  <v-row justify="center">
    <v-col cols="10">
      <ubiq-table
        :items="blocksStore.blocks"
        :headers="headers"
        :loading="loading"
        @refresh="refresh"
        item-key="number"
      >
        <template v-slot:topMessage>
          Showing {{ formatNumber(blocksStore.blocks.length) }} blocks from a
          total {{ formatNumber(blocksStore.total) }} blocks
        </template>
        <template v-slot:item.number="data">
          <nuxt-link
            :to="{ name: 'block-number', params: { number: data.value } }"
            >{{ data.value }}</nuxt-link
          >
        </template>
        <template v-slot:item.transactions="data">
          <template v-if="data.value !== 0">
            <nuxt-link
              :to="{
                name: 'transactions-type',
                params: { type: 'latest' }
              }"
              >{{ data.value }}</nuxt-link
            >
          </template>
          <template v-else>
            <span>{{ data.value }}</span>
          </template>
        </template>
        <template v-slot:item.miner="data">
          <nuxt-link :to="{ name: 'Address', params: { hash: data.value } }">{{
            getAddressTag(data.value)
          }}</nuxt-link>
        </template>
        <template v-slot:item.gasUsed="data">
          {{ data.value }} ({{ calcGasUsed(data.value, data.item.gasLimit) }})
        </template>
        <template v-slot:item.avgGasPrice="data">
          <span v-if="data.value !== 'NaN'"
            >{{ fromWeiToGwei(data.value) }} gwei</span
          >
          <span v-else>-</span>
        </template>
        <template v-slot:item.blockReward="data">
          {{ fromWei(addTxFees(data.value, data.item.txFees)) }}
          UBQ
        </template>
      </ubiq-table>
    </v-col>
  </v-row>
</template>

<script>
import ubiqTable from '~/components/UbiqTable.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  name: 'Blocks',
  components: {
    ubiqTable
  },
  data() {
    return {
      loading: false,
      headers: [
        {
          text: 'Height',
          value: 'number',
          sortable: false
        },
        {
          text: 'Txns',
          value: 'transactions',
          sortable: false
        },
        {
          text: 'Uncles',
          value: 'uncles',
          sortable: false
        },
        {
          text: 'Miner',
          value: 'miner',
          sortable: false
        },
        {
          text: 'GasUsed',
          value: 'gasUsed',
          sortable: false
        },
        {
          text: 'GasLimit',
          value: 'gasLimit',
          sortable: false
        },
        {
          text: 'Avg.GasPrice',
          value: 'avgGasPrice',
          sortable: false
        },
        {
          text: 'Reward',
          value: 'blockReward',
          sortable: false
        }
      ]
    }
  },
  computed: {
    blocksStore() {
      return this.$store.state.blocks
    }
  },
  async fetch({ store }) {
    await store.dispatch('blocks/fetchBlocks')
  },
  created() {
    setTimeout(() => {
      this.refresh()
    }, 60000)
  },
  methods: {
    async refresh() {
      this.loading = true
      await this.$store.dispatch('blocks/fetchBlocks')
      this.loading = false
    },
    getRowCount(items) {
      return items.length
    },
    fromWei(value) {
      return common.fromWei(value)
    },
    fromWeiToGwei(value) {
      return common.fromWeiToGwei(value)
    },
    addTxFees(reward, txFees) {
      return common.addTxFees(reward, txFees)
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash.substring(0, 17) + '...'
    },
    calcGasUsed(gasUsed, gasLimit) {
      return ((gasUsed / gasLimit) * 100).toFixed(2) + '%'
    },
    formatNumber(val) {
      return common.formatNumber(val)
    }
  }
  // watch: {
  //   $route: {
  //     handler(from, to) {
  //       this.fetch()
  //     },
  //     immediate: true
  //   }
  // }
}
</script>
