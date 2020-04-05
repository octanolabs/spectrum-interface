<template>
  <v-row align="center" style="height: 105px;">
    <v-spacer></v-spacer>
    <v-col cols="2">
      <v-card light>
        <v-card-text>
          <div class="d-flex flex-column align-center">
            <label>Amount</label>
            <label>{{ value }} UBQ</label>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-spacer></v-spacer>
    <v-col cols="9">
      <div class="d-flex flex-column">
        <strong
          >TX#
          <nuxt-link
            :to="{ name: 'transaction-hash', params: { hash: hash.full } }"
            >{{ hash.short }}</nuxt-link
          >...</strong
        >
        <label
          >From
          <nuxt-link :to="{ name: 'Address', params: { hash: from.full } }">{{
            from.short
          }}</nuxt-link>
          To
          <nuxt-link :to="{ name: 'Address', params: { hash: to.full } }">{{
            to.short
          }}</nuxt-link></label
        >
      </div>
    </v-col>
  </v-row>
</template>

<script>
import common from '../scripts/common.js'
import addresses from '../scripts/addresses.js'

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
      hash: {},
      from: {},
      to: {},
      value: 0,
      time: 0
    }
  },
  created() {
    this.hash = {
      full: this.info.hash,
      short: this.info.hash.substring(0, 25).toUpperCase()
    }
    this.from = {
      full: this.info.from,
      short:
        addresses.getAddressTag(this.info.from) ||
        this.info.from.substring(0, 17) + '...'
    }
    this.to = {
      full: this.info.to,
      short:
        addresses.getAddressTag(this.info.to) ||
        this.info.to.substring(0, 17) + '...'
    }
    this.value = common.fromWei(this.info.value)
  }
}
</script>
