<template>
  <v-row justify="center">
    <v-col cols="12">
      <uncle-page :uncle="uncle" />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import unclePage from '~/components/page/unclePage'

export default {
  name: 'Uncle',
  components: {
    unclePage,
  },
  props: {
    hash: {
      type: String,
      default: () => {
        return ''
      },
    },
  },
  async fetch() {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_uncleByHash',
      params: [this.$route.params.hash],
      id: 88,
    })

    this.uncle = result
  },
  data() {
    return {
      uncle: {},
    }
  },
}
</script>
