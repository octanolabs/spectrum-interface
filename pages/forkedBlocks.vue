<template>
  <v-row justify="center">
    <v-col cols="10">
      <ubiq-table
        :items="forkedBlocksStore.reorgs"
        :headers="headers"
        :loading="loading"
        @refresh="refresh"
        :showExpand="true"
        item-key="number"
      >
        <template v-slot:topMessage>
          Showing latest {{ forkedBlocksStore.reorgs.length }} forked blocks
        </template>
        <template v-slot:item.number="data">
          <nuxt-link :to="{ name: 'Block', params: { number: data.value } }">{{
            data.value
          }}</nuxt-link>
        </template>
        <template v-slot:item.timestamp="data">
          ~{{ calcTime(data.value) }}
        </template>
        <template v-slot:item.miner="data">
          <nuxt-link :to="{ name: 'Address', params: { hash: data.value } }">{{
            getAddressTag(data.value)
          }}</nuxt-link>
        </template>
        <template v-slot:item.blockReward="data">
          {{ fromWei(data.value) }} UBQ
        </template>
        <template v-slot:expanded-item="data">
          <v-row>
            <v-col>
              <span class="code">Hash: {{ data.item.hash }}</span>
              <br />
              <span class="code">Miner:</span>
              <nuxt-link
                :to="{ name: 'Address', params: { hash: data.item.miner } }"
                >{{ getAddressTag(data.item.miner) }}</nuxt-link
              >
              <br />
              <span class="code">Nonce: {{ data.item.nonce }}</span>
            </v-col>
            <v-col>
              <span class="code">Canonical chain hash:</span>
              <nuxt-link
                :to="{
                  name: 'Block',
                  params: { number: data.item.canonicalblock.number }
                }"
              >
                {{ data.item.canonicalblock.hash }}</nuxt-link
              >
              <br />
              <span class="code">Miner:</span>
              <nuxt-link
                :to="{
                  name: 'Address',
                  params: { hash: data.item.canonicalblock.miner }
                }"
                >{{ getAddressTag(data.item.canonicalblock.miner) }}</nuxt-link
              >
              <br />
              <span class="code"
                >Nonce: {{ data.item.canonicalblock.nonce }}</span
              >
            </v-col>
          </v-row>
        </template>
        <template v-slot:item.data-table-expand="data">
          <b-button @click.stop="fetchBlock(data)" size="sm" class="mr-2">
            {{ data.detailsShowing ? 'Hide' : 'Show' }} Details
          </b-button>
        </template>
      </ubiq-table>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import common from '../scripts/common'
import addresses from '../scripts/addresses'
import ubiqTable from '~/components/UbiqTable.vue'

export default {
  components: {
    ubiqTable
  },
  data() {
    return {
      loading: false,
      headers: [
        {
          text: 'Height',
          value: 'number'
        },
        {
          text: 'Age',
          value: 'timestamp'
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
          text: 'GasLimit',
          value: 'gasLimit'
        },
        {
          text: 'Reward',
          value: 'blockReward'
        },
        {
          text: '',
          value: 'data-table-expand'
        }
      ]
    }
  },
  computed: {
    forkedBlocksStore() {
      return this.$store.state.reorgs
    }
  },
  async fetch({ store }) {
    await store.dispatch('reorgs/fetchReorgs')
    store.dispatch('reorgs/fetchCanonicalBlocks')
  },
  created() {
    setTimeout(() => {
      this.refresh()
    }, 60000)
  },
  methods: {
    async refresh() {
      this.loading = true
      await this.$store.dispatch('reorgs/fetchReorgs')
      this.loading = false
    },
    fetchBlock(data) {
      if (data.item.canonicalblock === undefined) {
        axios
          .get(process.env.config.apiUrl + `/block/${data.item.number}`)
          .then((response) => {
            data.item.canonicalblock = response.data
            data.toggleDetails()
          })
      } else {
        data.toggleDetails()
      }
    },
    getRowCount(items) {
      return items.length
    },
    fromWei(value) {
      return common.fromWei(value)
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash.substring(0, 17) + '...'
    },
    toTH(diff) {
      return common.toTH(diff, 3) + ' TH'
    },
    calcTime(timestamp) {
      return this.$moment().to(timestamp * 1000)
    }
  }
}
</script>
