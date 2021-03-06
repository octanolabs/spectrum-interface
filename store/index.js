import axios from 'axios'
import common from '~/scripts/common'

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
      extraData: '',
    },
    txnCounts: {
      data: [],
      labels: [],
    },
  },
  summary: {
    txns: [],
    txnCount: 0,
    blocks: [],
    hashrate: '',
    blocktime: 0,
    difficulty: 0,
  },
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
  },
}

export const actions = {
  async fetchStats({ commit }) {
    const {
      data: { result: status },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_status',
      params: [],
      id: 88,
    })

    commit('SET_STATS', status)
  },
  async fetchChainSummary({ commit }) {
    const {
      data: {
        result: { txns, total: txnCount },
      },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestTransactions',
      params: [12],
      id: 88,
    })

    const {
      data: {
        result: { blocks },
      },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestBlocks',
      params: [12],
      id: 88,
    })

    const { blocktime, hashrate } = common.calcAvgBlocktime(blocks)

    const difficulty = common.toTH(blocks[0].difficulty, 2)

    commit('SET_SUMMARY', {
      txns,
      txnCount,
      blocks,
      blocktime,
      hashrate,
      difficulty,
    })
  },
}
