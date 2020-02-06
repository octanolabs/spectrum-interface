<template>
  <v-row justify="center">
    <v-col md="10">
      <v-breadcrumbs>
        <v-breadcrumbs-item :to="{ name: 'Home' }">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item active>Blocks</v-breadcrumbs-item>
        <v-btn
          nuxt
          :class="{
            fa: true,
            'fa-refresh': true,
            'fa-spin': refreshing,
            'btn-breadcrumb': true
          }"
          v-on:click="fetch()"
        ></v-btn>
      </v-breadcrumbs>
      <v-data-table :items="blocks" :headers="headers">
        <template v-slot:item.number="data">
          <nuxt-link :to="{ name: 'Block', params: { number: data.value } }">{{
            data.value
          }}</nuxt-link>
        </template>
        <template v-slot:item.transactions="data">
          <template v-if="data.value !== 0">
            <nuxt-link
              :to="{
                name: 'Transactions',
                params: { type: 'block', blockNumber: data.item.number }
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
      </v-data-table>
    </v-col>
  </v-row>
</template>

<script>
// import BlocksTable from '~/components/tables/Blocks.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  name: 'Blocks',
  // components: {
  //   BlocksTable
  // },
  data() {
    return {
      refreshing: false,
      headers: [
        {
          text: 'Height',
          value: 'number'
        },
        {
          text: 'Txns',
          value: 'transactions'
        },
        {
          text: 'Uncles',
          value: 'uncles'
        },
        {
          text: 'Miner',
          value: 'miner'
        },
        {
          text: 'GasUsed',
          value: 'gasUsed'
        },
        {
          text: 'GasLimit',
          value: 'gasLimit'
        },
        {
          text: 'Avg.GasPrice',
          value: 'avgGasPrice'
        },
        {
          text: 'Reward',
          value: 'blockReward'
        }
      ]
    }
  },
  computed: {
    blocks() {
      return this.$store.state.blocks.blocks
    }
  },
  fetch({ store }) {
    store.dispatch('blocks/fetchBlocks')
  },
  methods: {
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
