<template>
  <v-row justify="center">
    <v-col md="10">
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
    unclePage
  },
  props: {
    hash: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  async fetch() {
    const { data } = await axios.get(
      process.env.config.apiUrl + `/uncle/${this.$route.params.hash}`
    )

    this.uncle = data
  },
  data() {
    return {
      uncle: {}
    }
  }
}
</script>
