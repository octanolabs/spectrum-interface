<template>
  <v-col cols="12">
    <tokens-table :tokens="tokens" :ubq-price="price" />
  </v-col>
</template>

<script>
import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import tokensTable from '~/components/tables/tokensTable'

export default {
  components: {
    tokensTable,
  },
  data() {
    return {
      tokens: [],
      price: 0,
    }
  },
  async created() {
    this.tokens = await this.getAllTokensOnShinobi()
  },
  methods: {
    async getAllTokensOnShinobi() {
      const TOKENS_TO_FETCH = 100
      const UBQ_PRICE = gql`
        query bundles {
          bundles(where: { id: 1 }) {
            id
            ethPrice
          }
        }
      `
      const ALL_TOKENS = gql`
        query tokens($skip: Int!) {
          tokens(
            first: 500
            skip: $skip
            orderBy: tradeVolumeUSD
            orderDirection: desc
          ) {
            id
            name
            symbol
            derivedETH
            tradeVolume
            tradeVolumeUSD
            untrackedVolumeUSD
            totalLiquidity
            txCount
          }
        }
      `
      const client = new ApolloClient({
        link: new HttpLink({
          uri: 'https://graphnode.octano.dev/subgraphs/name/octanolabs/shinobi',
        }),
        cache: new InMemoryCache(),
        shouldBatch: true,
      })
      try {
        let allFound = false
        let skipCount = 0
        let tokens = []
        while (!allFound) {
          const price = await client.query({
            query: UBQ_PRICE,
            variables: {
              skip: skipCount,
            },
            fetchPolicy: 'cache-first',
          })
          const result = await client.query({
            query: ALL_TOKENS,
            variables: {
              skip: skipCount,
            },
            fetchPolicy: 'cache-first',
          })
          tokens = tokens.concat(result?.data?.tokens)
          if (
            result?.data?.tokens?.length < TOKENS_TO_FETCH ||
            tokens.length > TOKENS_TO_FETCH
          ) {
            allFound = true
          }
          skipCount = skipCount += TOKENS_TO_FETCH
          this.price = price.data.bundles[0].ethPrice
        }
        console.log(tokens)
        return tokens
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>
