<template>
  <v-list-item style="border-bottom: 1px solid #2e2e2e">
    <v-list-item-avatar tile color="#333">
      <v-icon>mdi-cube-outline</v-icon>
    </v-list-item-avatar>
    <v-list-item-content style="max-width: 120px">
      <v-list-item-title>
        <nuxt-link :to="`/block/${number}`">{{ number }}</nuxt-link>
      </v-list-item-title>
      <v-list-item-subtitle>{{ timeSince }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-content style="text-align: left">
      <v-list-item-title>
        <v-icon small>mdi-pickaxe</v-icon>
        <nuxt-link
          :to="{ name: 'address-account', params: { account: miner.full } }"
        >
          {{ miner.short }}
        </nuxt-link>
      </v-list-item-title>
      <v-list-item-subtitle>
        <label v-if="txns.length > 0">
          <nuxt-link :to="`/block/${number}?tab=transactions`">
            {{ txns.length }} txns
          </nuxt-link>
        </label>
        <label v-else> {{ txns.length }} txns </label>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-chip label small>{{ nf.format(reward) }} ubq</v-chip>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { getPersona } from '@octano/persona'
import addresses from '../../../scripts/addresses'
import rewards from '../../../scripts/rewards'
export default {
  props: {
    info: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      hash: '',
      number: 0,
      txns: 0,
      miner: {},
      reward: 0,
      time: 0,
      timeSince: 0,
      nf: new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 6,
      }),
    }
  },
  watch: {
    info(val) {
      this.setData(val)
    },
  },
  created() {
    this.setData(this.info)
    // update timeSince every 10 seconds
    const self = this
    setInterval(function () {
      self.timeSince = self.$moment().to(self.time)
    }, 10000)
  },
  methods: {
    getAddressTag(hash) {
      const tag = addresses.getAddressTag(hash)
      if (tag) {
        return tag
      }

      const persona = getPersona(hash)
      return persona.name.given + ' ' + persona.name.family
    },
    setData(val) {
      this.hash = val.hash
      this.number = val.number
      this.txns = val.transactions
      this.miner = {
        short: this.getAddressTag(val.miner),
        full: val.miner,
      }
      this.reward = rewards.calculateTotalRewards(
        val.blockReward,
        val.uncles,
        val.txFees
      )
      this.time = val.timestamp * 1000
      this.timeSince = this.$moment().to(this.time)
    },
  },
}
</script>
