<template>
  <v-list-item style="border-bottom: 1px solid #2e2e2e">
    <v-list-item-avatar tile color="#333">
      <v-icon>mdi-bank-transfer</v-icon>
    </v-list-item-avatar>
    <v-list-item-content style="max-width: 200px">
      <v-list-item-title>
        <nuxt-link
          :to="{ name: 'transaction-hash', params: { hash: hash.full } }"
        >
          {{ hash.short }}...
        </nuxt-link>
      </v-list-item-title>
      <v-list-item-subtitle>{{ timeSince }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-content>
      <v-list-item-title>
        From
        <nuxt-link
          :to="{ name: 'account-address', params: { address: from.full } }"
        >
          {{ from.short }}
        </nuxt-link>
      </v-list-item-title>
      <v-list-item-subtitle>
        To
        <nuxt-link
          :to="{ name: 'account-address', params: { address: to.full } }"
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
      short:
        addresses.getAddressTag(this.info.from) ||
        this.info.from.substring(0, 17) + '...',
    }
    this.to = {
      full: this.info.to,
      short:
        addresses.getAddressTag(this.info.to) ||
        this.info.to.substring(0, 17) + '...',
    }
    this.value = common.fromWei(this.info.value, 6)
    this.time = this.info.timestamp * 1000
    this.timeSince = this.$moment().to(this.time)
  },
}
</script>
