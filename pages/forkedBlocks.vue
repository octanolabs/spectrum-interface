<template>
  <!--  TODO: add to table: when forked block is included as uncle-->
  <v-row justify="center">
    <v-col cols="10">
      <expansion-table
        :items="store.forkedBlocks"
        :headers="headers"
        :loading="$fetchState.pending"
        @refresh="$fetch()"
      >
        <template v-slot:topMessage>
          Showing {{ store.total }} of {{ store.forkedBlocks.length }} forked
          blocks. Due to the way block propagation works, this is just a view
          from the go-ubiq node this spectrum instance is using, and doesn't
          reflect the entire state of the network.
        </template>
        <template v-slot:item.number="data">
          <nuxt-link :to="{ name: 'block-id', params: { id: data.value } }">{{
            data.value
          }}</nuxt-link>
        </template>
        <template v-slot:item.timestamp="data">
          ~{{ calcTime(data.value) }}
        </template>
        <template v-slot:item.miner="data">
          <nuxt-link
            :to="{ name: 'account-address', params: { address: data.value } }"
            >{{ getAddressTag(data.value) }}</nuxt-link
          >
        </template>
        <template v-slot:item.includedAsUncle="data">
          <template v-if="data.value">yes</template>
          <template v-else>no</template>
        </template>
        <template v-slot:expanded-item="{ item }">
          <v-row justify="space-around">
            <v-col lg="7" sm="8">
              <span>Forked Block:</span>
              <hr />
              <span class="code">Hash: {{ item.hash }}</span>
              <br />
              <span class="code">Miner:</span>
              <nuxt-link
                :to="{
                  name: 'account-address',
                  params: { address: item.miner },
                }"
                >{{ getAddressTag(item.miner) }}
              </nuxt-link>
              <br />
              <span class="code">Nonce: {{ item.nonce }}</span>
            </v-col>
            <v-col lg="5" sm="8">
              <span>Canonical Chain:</span>
              <hr />
              <span class="code">Hash:</span>
              <nuxt-link
                :to="{
                  name: 'block-id',
                  params: { id: item.canonicalblock.number },
                }"
              >
                {{ item.canonicalblock.hash.substring(0, 32) }}...
              </nuxt-link>
              <br />
              <span class="code">Miner:</span>
              <nuxt-link
                :to="{
                  name: 'Address',
                  params: { hash: item.canonicalblock.miner },
                }"
              >
                {{ getAddressTag(item.canonicalblock.miner) }}
              </nuxt-link>
              <br />
              <span class="code">Nonce: {{ item.canonicalblock.nonce }}</span>
            </v-col>
          </v-row>
          <v-row v-if="item.includedAsUncle">
            <v-col>
              <hr />
              Included as uncle
              <nuxt-link
                :to="{ name: 'uncle-hash', params: { hash: item.hash } }"
              >
                {{ item.hash.substring(0, 17) }}...
              </nuxt-link>
            </v-col>
          </v-row>
        </template>
      </expansion-table>
    </v-col>
  </v-row>
</template>

<script>
import common from '../scripts/common'
import addresses from '../scripts/addresses'
import expansionTable from '~/components/util/ExpansionTable'

export default {
  name: 'ForkedBlocks',
  components: {
    expansionTable,
  },
  async fetch() {
    await this.$store.dispatch('forkedblocks/fetchForkedBlocks')
  },
  data() {
    return {
      headers: [
        {
          text: 'Height',
          value: 'number',
        },
        {
          text: 'Miner',
          value: 'miner',
        },
        {
          text: 'Seen',
          value: 'timestamp',
        },
        {
          text: 'Included as Uncle',
          value: 'includedAsUncle',
        },
      ],
    }
  },
  computed: {
    store() {
      return this.$store.state.forkedblocks
    },
  },
  created() {
    setTimeout(() => {
      this.$fetch()
    }, 60000)
  },
  methods: {
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
    },
  },
}
</script>
