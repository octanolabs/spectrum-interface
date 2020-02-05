<template>
  <v-row>
    <v-col md="12">
      <nav style="margin-right:-4px;">
        <v-pagination
          :total-rows="getRowCount(items)"
          :per-page="perPage"
          v-model="currentPage"
          size="md"
          align="right"
          prev-text="Prev"
          next-text="Next"
        />
      </nav>
      <b-card no-body>
        <v-data-table
          @row-hovered="dbg"
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          class="mb-0"
          responsive="sm"
          stacked="sm"
          hover
          striped
        >
          <div slot="number" slot-scope="data">
            <nuxt-link
              :to="{ name: 'Block', params: { number: data.value } }"
              >{{ data.value }}</nuxt-link
            >
          </div>
          <div slot="timestamp" slot-scope="data">
            ~{{ calcTime(data.value) }}
          </div>
          <div slot="miner" slot-scope="data">
            <nuxt-link
              :to="{ name: 'Address', params: { hash: data.value } }"
              >{{ getAddressTag(data.value) }}</nuxt-link
            >
          </div>
          <div slot="blockReward" slot-scope="data">
            {{ fromWei(data.value) }} UBQ
          </div>
          <div slot="row-details" slot-scope="data">
            <div class="nested-col-grid">
              <div class="">
                <span class="code">Hash: {{ data.item.hash }}</span>
                <br />
                <span class="code">Miner:</span>
                <nuxt-link
                  :to="{ name: 'Address', params: { hash: data.item.miner } }"
                  >{{ getAddressTag(data.item.miner) }}</nuxt-link
                >
                <br />
                <span class="code">Nonce: {{ data.item.nonce }}</span>
              </div>
              <div class="">
                <span class="code">Canonical chain hash:</span
                ><nuxt-link
                  :to="{
                    name: 'Block',
                    params: { number: data.item.canonicalblock.number }
                  }"
                  >{{ data.item.canonicalblock.hash }}</nuxt-link
                >
                <br />
                <span class="code">Miner:</span>
                <nuxt-link
                  :to="{
                    name: 'Address',
                    params: { hash: data.item.canonicalblock.miner }
                  }"
                  >{{
                    getAddressTag(data.item.canonicalblock.miner)
                  }}</nuxt-link
                >
                <br />
                <span class="code"
                  >Nonce: {{ data.item.canonicalblock.nonce }}</span
                >
              </div>
            </div>
          </div>
          <div slot="showDetails" slot-scope="data">
            <b-button @click.stop="fetchBlock(data)" size="sm" class="mr-2">
              {{ data.detailsShowing ? 'Hide' : 'Show' }} Details
            </b-button>
          </div>
        </v-data-table>
      </b-card>
      <nav style="margin-right:-4px;margin-top:15px;">
        <v-pagination
          :total-rows="getRowCount(items)"
          :per-page="perPage"
          v-model="currentPage"
          size="md"
          align="right"
          prev-text="Prev"
          next-text="Next"
        />
      </nav>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import common from '../../scripts/common'
import addresses from '../../scripts/addresses'
export default {
  props: {
    items: {
      type: Array
    }
  },
  data: () => {
    return {
      currentPage: 1,
      perPage: 25,
      totalRows: 0,
      fields: {
        number: {
          label: 'Height'
        },
        timestamp: {
          label: 'Age'
        },
        transactions: {
          label: 'Txns'
        },
        uncles: {
          label: 'Uncles'
        },
        gasLimit: {
          label: 'GasLimit'
        },
        blockReward: {
          label: 'Reward'
        },
        showDetails: {
          label: ''
        }
      }
    }
  },
  methods: {
    dbg(i, idx, e) {
      console.log(i, idx, e)
    },
    fetchBlock(data) {
      console.log(data)
      if (data.item.canonicalblock === undefined) {
        axios
          .get(this.$store.state.api + `block/${data.item.number}`)
          .then((response) => {
            data.item.canonicalblock = response.data
            data.toggleDetails()
          })
          .catch((e) => {
            this.errors.push(e)
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
