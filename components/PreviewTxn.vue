<template>
  <div style="color: rgba(255, 255, 255, 0.5);padding:12px 15px 0;">
    <v-row>
      <strong
        >TX#
        <nuxt-link :to="{ name: 'Transaction', params: { hash: hash.full } }">{{
          hash.short
        }}</nuxt-link
        >...</strong
      >
    </v-row>
    <v-row>
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
    </v-row>
    <v-row>
      <label>Amount {{ value }} UBQ</label>
    </v-row>
    <hr style="margin:5px 0 4px 0;" />
  </div>
</template>

<script>
import common from '../scripts/common.js'
import addresses from '../scripts/addresses.js'

export default {
  props: ['info'],
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
