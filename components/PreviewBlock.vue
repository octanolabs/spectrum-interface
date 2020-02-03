<template>
  <v-row>
    <v-col cols="4">
      <v-card>
        <v-card-text>
          <div class="d-flex flex-column">
            <span> Block {{ number }} </span>
            <span>
              <small>{{ timeSince }}</small>
            </span>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-row>
        <strong
          >Mined By
          <nuxt-link :to="{ name: 'Address', params: { hash: miner.full } }">{{
            miner.short
          }}</nuxt-link></strong
        >
      </v-row>
      <v-row>
        <label
          ><nuxt-link
            :to="{
              name: 'Transactions',
              params: { type: 'block', blockNumber: number }
            }"
            >{{ txns }} txns</nuxt-link
          ></label
        >
      </v-row>
      <v-row>
        <label>Block Reward {{ reward }} UBQ</label>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import addresses from '../scripts/addresses'
import rewards from '../scripts/rewards'
export default {
  props: ['info'],
  data() {
    return {
      hash: '',
      number: 0,
      txns: 0,
      miner: {},
      reward: 0,
      time: 0,
      timeSince: 0
    }
  },
  watch: {
    info(val) {
      this.setData(val)
    }
  },
  created() {
    this.setData(this.info)
    // update timeSince every 10 seconds
    const self = this
    setInterval(function() {
      self.timeSince = self.$moment().to(self.time)
    }, 10000)
  },
  methods: {
    setData(val) {
      this.hash = val.hash
      this.number = val.number
      this.txns = val.transactions
      this.miner = {
        short:
          addresses.getAddressTag(val.miner) ||
          val.miner.substring(0, 17) + '...',
        full: val.miner
      }
      this.reward = rewards.calculateMintedCoins(val.number, val.uncles)
      this.time = val.timestamp * 1000
      this.timeSince = this.$moment().to(this.time)
    }
  }
}
</script>
