<template>
  <v-col cols="12">
    <tokens-table :tokens="getTokens()" />
  </v-col>
</template>

<script>
import tokensTable from '~/components/tables/tokensTable'
import tokens from '~/scripts/tokens'

export default {
  components: {
    tokensTable,
  },
  methods: {
    getTokens() {
      const tks = tokens.getTokens()
      const result = []

      for (const address of Object.keys(tks)) {
        if (tks[address].display) {
          const token = {
            name: tks[address].name,
            symbol: tks[address].symbol,
            decimals: tks[address].decimals,
            address,
          }

          result.push(token)
        }
      }

      return result
    },
  },
}
</script>
