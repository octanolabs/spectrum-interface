<template>
  <v-row align="center" style="height: 105px;">
    <v-spacer></v-spacer>
    <v-col cols="2">
      <v-card light>
        <v-card-text>
          <div class="d-flex flex-column align-center">
            <span> Block {{ number }} </span>
            <span>
              <small>{{ timeSince }}</small>
            </span>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-spacer></v-spacer>

    <v-col cols="9">
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
              name: 'block-id-action',
              params: { id: number, action: 'transactions' }
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
  props: {
    info: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
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
