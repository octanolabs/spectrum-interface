import axios from 'axios'
import common from '~/scripts/common'
import tokens from '~/scripts/tokens'

export const state = () => ({
  prices: {},
  stats: {
    timestamp: 0,
    symbol: 'UBQ',
    supply: '',
    latestBlock: {
      number: 0,
      timestamp: 0,
      transactions: 0,
      hash: '',
      parentHash: '',
      sha3Uncles: '',
      miner: '',
      difficulty: '',
      totalDifficulty: '',
      size: 0,
      gasUsed: 0,
      gasLimit: 0,
      nonce: '',
      uncles: 0,
      blockReward: '',
      unclesReward: '',
      avgGasPrice: '',
      txFees: '',
      extraData: ''
    },
    txnCounts: {
      data: [],
      labels: []
    }
  },
  summary: {
    txns: [],
    txnCount: 0,
    blocks: [],
    hashrate: '',
    blocktime: 0,
    difficulty: 0
  }
})

export const mutations = {
  SET_SUMMARY(state, payload) {
    state.summary = { ...payload }
  },
  SET_PRICES(state, payload) {
    state.prices = { ...payload }
  },
  SET_STATS(state, payload) {
    state.stats = { ...payload }
  }
}

export const actions = {
  async fetchStats({ commit }) {
    const { data: status } = await axios.get(
      process.env.config.apiUrl + '/status'
    )

    commit('SET_STATS', status)
  },
  async fetchPrices({ commit }) {
    const prices = {}
    const tokenObj = tokens.getTokens()

    const data = await Promise.all([
      Promise.resolve(
        axios.get('https://api.coingecko.com/api/v3/coins/ubiq/tickers')
      ).then(
        ({
          data: {
            tickers: [{ converted_last: last }, ,]
          }
        }) => {
          return { symbol: 'ubq', ...last }
        }
      ),
      ...Object.keys(tokenObj)
        .filter((token) => {
          return tokenObj[token].traded
        })
        .map(async (token) => {
          const { name, symbol } = tokenObj[token]
          const {
            data: {
              tickers: [{ converted_last: last }, ,]
            }
          } = await axios.get(
            `https://api.coingecko.com/api/v3/coins/${name.toLowerCase()}/tickers`
          )
          return { symbol: symbol.toLowerCase(), ...last }
        })
    ])

    data.forEach((price) => {
      // TODO: add synthetic ubiq price for tokens
      const { symbol, usd, btc } = price
      prices[symbol] = { usd, btc }
    })

    commit('SET_PRICES', prices)
  },
  async fetchChainSummary({ commit }) {
    const {
      data: { txns, total: txnCount }
    } = await axios.get(process.env.config.apiUrl + '/latesttransactions/12')

    const {
      data: { blocks }
    } = await axios.get(process.env.config.apiUrl + '/latestblocks/12')

    const { blocktime, hashrate } = common.calcAvgBlocktime(blocks)

    const difficulty = common.toTH(blocks[0].difficulty, 2)

    commit('SET_SUMMARY', {
      txns,
      txnCount,
      blocks,
      blocktime,
      hashrate,
      difficulty
    })
  }
}
