<template>
  <v-row class="justify-content-md-center">
    <v-col md="10">
      <v-breadcrumbs>
        <v-breadcrumbs-item :to="{ name: 'Home' }">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item :to="{ name: 'Uncles' }">Uncles</v-breadcrumbs-item>
        <v-breadcrumbs-item active>{{ hash }}</v-breadcrumbs-item>
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
      <v-card no-body class="block-card">
        <v-row class="card-row">
          <v-col md="3">
            Uncle Height:
          </v-col>
          <v-col md="9">
            {{ uncle.number }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Uncle Position:
          </v-col>
          <v-col md="9">
            {{ uncle.position }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Block Height:
          </v-col>
          <v-col md="9">
            <nuxt-link
              :to="{ name: 'Block', params: { number: uncle.blockNumber } }"
              >{{ uncle.blockNumber }}</nuxt-link
            >
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Hash:
          </v-col>
          <v-col md="9">
            {{ uncle.hash }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Parent Hash:
          </v-col>
          <v-col md="9">
            {{ uncle.parentHash }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Sha3Uncles:
          </v-col>
          <v-col md="9">
            {{ uncle.sha3Uncles }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Mined By:
          </v-col>
          <v-col md="9">
            <nuxt-link
              :to="{ name: 'Address', params: { hash: uncle.miner } }"
              >{{ getAddressTag(uncle.miner) }}</nuxt-link
            >
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Difficulty:
          </v-col>
          <v-col md="9">
            {{ formatNumber(uncle.difficulty) }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Gas Used:
          </v-col>
          <v-col md="9">
            {{ formatNumber(uncle.gasUsed) }} ({{
              calcGasUsed(uncle.gasUsed, uncle.gasLimit)
            }})
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Gas Limit:
          </v-col>
          <v-col md="9">
            {{ formatNumber(uncle.gasLimit) }}
          </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            TimeStamp:
          </v-col>
          <v-col md="9"> ~{{ calcTime(uncle.timestamp) }} </v-col>
        </v-row>
        <v-row class="card-row">
          <v-col md="3">
            Uncle Reward:
          </v-col>
          <v-col md="9"> {{ fromWei(uncle.reward) }} UBQ </v-col>
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
  name: 'Uncle',
  props: {
    hash: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      refreshing: false,
      uncle: {}
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
  methods: {
    fetch() {
      this.refreshing = true
      axios
        .get(this.$store.state.api + 'uncle/' + this.hash)
        .then((response) => {
          this.uncle = response.data
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
      return common.formatNumber(val)
    },
    fromWei(val) {
      return common.fromWei(val)
    }
  }
}
</script>
