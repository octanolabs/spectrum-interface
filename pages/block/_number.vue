<template>
  <v-row justify="center">
    <v-col md="10">
      <v-breadcrumbs>
        <v-breadcrumbs-item :to="{ name: 'Home' }">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item :to="{ name: 'Blocks' }">Blocks</v-breadcrumbs-item>
        <v-breadcrumbs-item active>{{ number }}</v-breadcrumbs-item>
        <nuxt-link>
          <b-button
            :class="{
              fa: true,
              'fa-refresh': true,
              'fa-spin': refreshing,
              'btn-breadcrumb': true
            }"
            v-on:click="fetch()"
          />
        </nuxt-link>
      </v-breadcrumbs>
      <v-card no-body class="block-card">
        <v-row class="card-row">
          <v-col md="3">
            Height:
          </v-col>
          <v-col md="9">
            <nuxt-link :to="{ name: 'Block', params: { number: number - 1 } }"
              ><span class="fa fa-arrow-left icon-left"
            /></nuxt-link>
            {{ block.number }}
            <nuxt-link
              v-if="fromHead > 0"
              :to="{ name: 'Block', params: { number: number - -1 } }"
              ><span class="fa fa-arrow-right icon-right"
            /></nuxt-link>
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            TimeStamp:
          </v-col>
          <v-col md="9"> ~{{ calcTime(block.timestamp) }} </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Transactions:
          </v-col>
          <v-col v-if="block.transactions !== 0" md="9">
            <nuxt-link
              :to="{
                name: 'Transactions',
                params: { type: 'block', blockNumber: number }
              }"
              >{{ block.transactions }} transactions</nuxt-link
            >
          </v-col>
          <v-col v-else md="9"> {{ block.transactions }} transactions </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Hash:
          </v-col>
          <v-col md="9">
            {{ block.hash }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Parent Hash:
          </v-col>
          <v-col md="9">
            <nuxt-link
              :to="{ name: 'Block', params: { number: number - 1 } }"
              >{{ block.parentHash }}</nuxt-link
            >
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Sha3Uncles:
          </v-col>
          <v-col md="9">
            {{ block.sha3Uncles }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Mined By:
          </v-col>
          <v-col v-if="isBlock" md="9">
            <nuxt-link
              :to="{ name: 'Address', params: { hash: block.miner } }"
              >{{ getAddressTag(block.miner) }}</nuxt-link
            >
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Difficulty:
          </v-col>
          <v-col md="9">
            {{ formatNumber(block.difficulty) }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Size:
          </v-col>
          <v-col md="9"> {{ formatNumber(block.size) }} bytes </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Gas Used:
          </v-col>
          <v-col md="9">
            {{ formatNumber(block.gasUsed) }} ({{
              calcGasUsed(block.gasUsed, block.gasLimit)
            }})
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Gas Limit:
          </v-col>
          <v-col md="9">
            {{ formatNumber(block.gasLimit) }}
          </v-col>
        </v-row>
        <v-row v-if="block.avgGasPrice !== 'NaN'" class="card-row">
          <v-col md="3">
            Avg. Gas Price:
          </v-col>
          <v-col md="9"> {{ fromWeiToGwei(block.avgGasPrice) }} gwei </v-col>
        </v-row>
        <v-row v-if="block.txFees !== '0'" class="card-row">
          <v-col md="3">
            Transaction Fees:
          </v-col>
          <v-col md="9"> {{ fromWei(block.txFees) }} UBQ </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Block Reward:
          </v-col>
          <v-col md="9"> {{ fromWei(block.blockReward) }} UBQ </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Uncles Reward:
          </v-col>
          <v-col md="9"> {{ fromWei(block.unclesReward) }} UBQ </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Nonce:
          </v-col>
          <v-col md="9">
            {{ block.nonce }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Extra Data:
          </v-col>
          <v-col md="9">
            {{ toUtf8(block.extraData) || toAscii(block.extraData) }} (hex:{{
              block.extraData
            }})
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import addresses from '~/scripts/addresses'
import common from '~/scripts/common'

export default {
  name: 'Block',
  data() {
    return {
      refreshing: false,
      block: {},
      isBlock: false
    }
  },
  computed: {
    fromHead() {
      return this.$store.state.latestBlock.number - this.block.number
    }
  },
  watch: {
    $route: {
      handler(from, to) {
        this.fetch()
      },
      immediate: true
    }
  },
  fetch({ store }) {
    store.dispatch('fetchIndexState')
  },
  created() {
    this.fetch()
  },
  methods: {
    fetch() {
      this.refreshing = true
      axios
        .get(this.$store.state.api + 'block/' + this.number)
        .then((response) => {
          this.block = response.data
          if (this.block.number) {
            this.isBlock = true
          }
        })
        .catch((e) => {
          this.errors.push(e)
        })

      const self = this
      setTimeout(function() {
        self.refreshing = false
      }, 2000)
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash
    },
    calcGasUsed(gasUsed, gasLimit) {
      return ((gasUsed / gasLimit) * 100).toFixed(2) + '%'
    },
    calcTime(timestamp) {
      return (
        this.$moment().to(timestamp * 1000) +
        ' (' +
        this.$moment.utc(timestamp * 1000).format('lll') +
        ' UTC)'
      )
    },
    formatNumber(val) {
      if (val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return null
      }
    },
    fromWei(val) {
      return common.fromWei(val)
    },
    fromWeiToGwei(val) {
      return common.fromWeiToGwei(val)
    },
    toAscii(val) {
      return common.toAscii(val)
    },
    toUtf8(val) {
      return common.toUtf8(val)
    }
  }
}
</script>
