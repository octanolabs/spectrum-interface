<template>
  <v-row justify="center">
    <v-col cols="6">
      <blockPage
        :latest-block="this.$store.state.stats.latestBlock"
        :block="block"
      />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import blockPage from '~/components/page/blockPage.vue'

export default {
  name: 'Block',
  components: {
    blockPage
  },
  validate({ params }) {
    if (/^\d+$/.test(params.id)) {
      return true
    }
    return /^0x([A-Fa-f0-9]{64})$/.test(params.id)
  },
  async fetch() {
    let method = ''

    if (/^\d+$/.test(this.$route.params.id)) {
      method = `/block/`
    } else {
      method = `/blockbyhash/`
    }

    const { data } = await axios.get(
      process.env.config.apiUrl + method + this.$route.params.id
    )
    this.block = data
  },
  data() {
    return {
      block: {}
    }
  },
  fetchOnServer: false,
  middleware({ store }) {
    store.dispatch('fetchIndexState')
  }
}
</script>
