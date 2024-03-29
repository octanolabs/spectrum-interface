<template>
  <v-list-item style="border-bottom: 1px solid #2e2e2e">
    <v-list-item-avatar tile color="#333">
      <v-icon>mdi-bank-transfer</v-icon>
    </v-list-item-avatar>
    <v-list-item-content style="max-width: 120px">
      <v-list-item-title>
        <nuxt-link :to="{ name: 'tx-hash', params: { hash: hash.full } }">
          {{ hash.short }}...
        </nuxt-link>
      </v-list-item-title>
      <v-list-item-subtitle>{{ timeSince }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-content style="min-width: 120px">
      <v-list-item-title>
        From
        <nuxt-link
          :to="{ name: 'address-account', params: { account: from.full } }"
        >
          {{ from.short }}
        </nuxt-link>
      </v-list-item-title>
      <v-list-item-subtitle>
        To
        <nuxt-link
          :to="{ name: 'address-account', params: { account: to.full } }"
        >
          {{ to.short }}
        </nuxt-link>
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <v-chip label small>{{ value }} ubq</v-chip>
    </v-list-item-action>
  </v-list-item>
</template>

<script>
import { getPersona } from '@octano/persona'
import common from '../../../scripts/common.js'
import addresses from '../../../scripts/addresses.js'

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
      hash: {},
      from: {},
      to: {},
      value: 0,
      time: 0,
      timeSince: 0,
    }
  },
  created() {
    this.hash = {
      full: this.info.hash,
      short: this.info.hash.substring(0, 8),
    }
    this.from = {
      full: this.info.from,
      short: this.getAddressTag(this.info.from),
    }
    this.to = {
      full: this.info.to,
      short: this.getAddressTag(this.info.to),
    }
    this.value = common.fromWei(this.info.value, 6)
    this.time = this.info.timestamp * 1000
    this.timeSince = this.$moment().to(this.time)
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
  },
}
</script>
