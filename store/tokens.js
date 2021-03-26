import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import axios from 'axios'
import consola from 'consola'

const syncInterval = 600000

const defaultTokenList =
  'https://raw.githubusercontent.com/octanolabs/default-token-list/master/uniswap-default.tokenlist.json'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://graphnode.octano.dev/subgraphs/name/octanolabs/shinobi',
  }),
  cache: new InMemoryCache(),
  shouldBatch: true,
})

export const getDefaultState = () => ({
  erc20: {},
  shinobi: {},
  list: [],
  pairs: {},
  ubqPrice: 0,
  lastSync: {},
})

export const state = getDefaultState()

export const mutations = {
  SET_ERC20S(state, payload) {
    state.erc20 = payload
    state.lastSync.erc20 = Date.now()
  },
  SET_SHINOBI_TOKENS(state, payload) {
    state.shinobi = payload.object
    state.list = payload.array
    state.erc20 = { ...state.erc20, ...payload.object }
    state.lastSync.shinobiTokens = Date.now()
  },
  SET_SHINOBI_PAIRS(state, payload) {
    state.pairs = payload
    state.lastSync.shinobiPairs = Date.now()
  },
  ADD_ERC20(state, payload) {
    state.erc20[payload.contract] = {
      name: payload.name,
      id: payload.contract,
      symbol: payload.symbol,
      decimals: payload.decimals,
    }
  },
  SET_UBQ_PRICE(state, payload) {
    state.ubqPrice = payload
    state.lastSync.ubqPrice = Date.now()
  },
}

export const actions = {
  addERC20({ commit }, payload) {
    commit('ADD_ERC20', payload)
  },
  async getNativePriceUsd({ commit, state }) {
    if (
      !state.lastSync.ubqPrice ||
      state.lastSync.ubqPrice < Date.now() - syncInterval
    ) {
      const UBQ_PRICE = gql`
        query bundles {
          bundles(where: { id: 1 }) {
            id
            ethPrice
          }
        }
      `
      try {
        const skipCount = 0
        // ubiq price (usd from shinobi)
        const price = await client.query({
          query: UBQ_PRICE,
          variables: {
            skip: skipCount,
          },
          fetchPolicy: 'cache-first',
        })
        commit('SET_UBQ_PRICE', price.data.bundles[0].ethPrice)
      } catch (e) {
        consola.log(e)
      }
    }
  },
  async getShinobiTokens({ commit, state }) {
    if (
      !state.lastSync.shinobiTokens ||
      state.lastSync.shinobiTokens < Date.now() - syncInterval
    ) {
      const TOKENS_TO_FETCH = 100
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
            decimals
            derivedETH
            tradeVolume
            tradeVolumeUSD
            untrackedVolumeUSD
            totalLiquidity
            txCount
          }
        }
      `
      try {
        let allFound = false
        let skipCount = 0
        let shinobiTokens = []
        // shinobi tokens
        while (!allFound) {
          const result = await client.query({
            query: ALL_TOKENS,
            variables: {
              skip: skipCount,
            },
            fetchPolicy: 'cache-first',
          })
          shinobiTokens = shinobiTokens.concat(result?.data?.tokens)
          if (
            result?.data?.tokens?.length < TOKENS_TO_FETCH ||
            shinobiTokens.length > TOKENS_TO_FETCH
          ) {
            allFound = true
          }
          skipCount = skipCount += TOKENS_TO_FETCH
        }
        const payload = {
          array: [],
          object: {},
        }
        for (const i in shinobiTokens) {
          // uWEXP name fix
          if (
            shinobiTokens[i].id === '0x068adbc25efa195f13e70812904761100046059c'
          ) {
            shinobiTokens[i].name = 'Expanse (Wrapped)'
          }
          payload.object[shinobiTokens[i].id] = shinobiTokens[i]
        }
        payload.array = shinobiTokens
        commit('SET_SHINOBI_TOKENS', payload)
      } catch (e) {
        consola.log(e)
      }
    }
  },
  async getShinobiPairs({ commit, state }) {
    if (
      !state.lastSync.shinobiPairs ||
      state.lastSync.shinobiPairs < Date.now() - syncInterval
    ) {
      const PAIRS_TO_FETCH = 100
      const ALL_PAIRS = gql`
        query pairs($skip: Int!) {
          pairs(
            first: 500
            skip: $skip
            orderBy: trackedReserveETH
            orderDirection: desc
          ) {
            id
            token0 {
              id
              symbol
              name
            }
            token1 {
              id
              symbol
              name
            }
          }
        }
      `
      try {
        let allFound = false
        let skipCount = 0
        let shinobiPairs = []
        // shinobi pairs
        while (!allFound) {
          const result = await client.query({
            query: ALL_PAIRS,
            variables: {
              skip: skipCount,
            },
            fetchPolicy: 'cache-first',
          })
          shinobiPairs = shinobiPairs.concat(result?.data?.pairs)
          if (
            result?.data?.pairs?.length < PAIRS_TO_FETCH ||
            shinobiPairs.length > PAIRS_TO_FETCH
          ) {
            allFound = true
          }
          skipCount = skipCount += PAIRS_TO_FETCH
        }
        const payload = {}
        for (const i in shinobiPairs) {
          payload[shinobiPairs[i].id] = shinobiPairs[i]
        }
        commit('SET_SHINOBI_PAIRS', payload)
      } catch (e) {
        consola.log(e)
      }
    }
  },
  async getDefaultTokens({ commit, state }) {
    if (!state.lastSync.erc20) {
      try {
        // default tokens
        const {
          data: { tokens },
        } = await axios.get(defaultTokenList, { json: true })

        const payload = {}
        for (const i in tokens) {
          payload[tokens[i].address.toLowerCase()] = tokens[i]
          payload[tokens[i].address.toLowerCase()].checksum = tokens[i].address
        }
        commit('SET_ERC20S', payload)
      } catch (e) {
        consola.log(e)
      }
    }
  },
}
