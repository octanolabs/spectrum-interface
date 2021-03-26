<template>
  <v-col cols="12">
    <breadcrumb-spinner no-loading />
    <v-alert color="primary" text outlined class="mt-1">
      Token information retrieved from
      <a href="https://shinobi-info.ubiq.ninja" target="_blank">
        <strong>Shinobi</strong>
      </a>
    </v-alert>
    <tokens-table :tokens="tokens" :ubq-price="price" />
  </v-col>
</template>

<script>
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import tokensTable from '~/components/tables/tokensTable'

export default {
  components: {
    tokensTable,
    breadcrumbSpinner,
  },
  async middleware({ store }) {
    await store.dispatch('tokens/getDefaultTokens')
    await store.dispatch('tokens/getShinobiTokens')
  },
  computed: {
    tokens() {
      return this.$store.state.tokens.list
    },
    price() {
      return this.$store.state.tokens.ubqPrice
    },
  },
}
</script>
