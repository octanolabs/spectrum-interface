<template>
  <v-col cols="12">
    <tokens-table :tokens="tokens" :ubq-price="price" />
  </v-col>
</template>

<script>
import tokensTable from '~/components/tables/tokensTable'

export default {
  components: {
    tokensTable,
  },
  computed: {
    tokens() {
      return this.$store.state.shinobi.tokens
    },
    price() {
      return this.$store.state.shinobi.ubqPrice
    },
  },
}
</script>
