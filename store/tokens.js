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

// I hate to have to add this but, people, so...
const tokenBlacklist = {
  '0x996fd5e4500eeb8af930b12f4c215e0f9aa76562': 'GetgleCoin - GLEE',
  '0x90940ee32f3590d571ec97c7cf1a23c78fd85064': 'Farting - FART',
  '0x27e9db81e49307687e6a9b1190825dd5c438b45e': 'Piss Coin - PISS',
  '0x3e607a939fd243b8c1666d4aff3af4a52d536633': 'rapecoin - RAPE',
  '0x85f81ace89ffafbde99ad7a2400f664a93d3c886': 'Child Molestation Coin - CMC',
  '0x929ef9ae80fa0fe24713734f4a0f7ae79bb80dd5': 'BuckBreakingCoin - BBC',
  '0xc54269b4b98a84812e12f8e2392d41a1a3ea5f77': 'Pedophile Coin - PEDO',
  '0xcf4a5aefdc0b25ecefad43eefbd8021678cb3765': 'Nigger Coin - NIGGER',
  '0xd364159f3f0ba87a993806c74f68b0a1fba72946': 'Homosexual Coin - GAY',
}

const isBlacklisted = function (contractAddress) {
  if (tokenBlacklist[contractAddress.toLowerCase()]) {
    return true
  }
  return false
}

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
          if (!isBlacklisted(shinobiTokens[i].id)) {
            payload.object[shinobiTokens[i].id] = shinobiTokens[i]
            payload.array.push(shinobiTokens[i])
          }
        }
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
