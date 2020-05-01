import axios from 'axios'
import common from '~/scripts/common'

export const state = () => ({
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
    price: {
      btc: '',
      usd: '',
      eur: ''
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
  SET_STATS(state, payload) {
    state.stats = { ...payload }
  },
  SET_SUMMARY(state, payload) {
    state.summary = { ...payload }
  }
}

export const actions = {
  async fetchIndexState({ commit }) {
    const { data: status } = await axios.get(
      process.env.config.apiUrl + '/status'
    )

    const {
      data: {
        ticker: { price: btcPrice }
      }
    } = await axios.get('https://api.cryptonator.com/api/ticker/ubq-btc')

    const {
      data: {
        bpi: {
          EUR: { rate: usdRate },
          USD: { rate: eurRate }
        }
      }
    } = await axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')

    const price = {
      btc: btcPrice,
      usd: common.mulFiat(btcPrice, eurRate.replace(',', '')),
      eur: common.mulFiat(btcPrice, usdRate.replace(',', ''))
    }

    commit('SET_STATS', { ...status, price })
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
