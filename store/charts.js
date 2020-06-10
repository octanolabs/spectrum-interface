import axios from 'axios'
import moment from 'moment'
import common from '~/scripts/common'

export const state = () => ({
  filled: false,
  // Blocks
  gasPrice: {
    name: '',
    data: []
  },
  gasLimit: {
    name: '',
    data: []
  },
  blocks: {
    name: '',
    data: []
  },
  blockTime: {
    name: '',
    data: []
  },
  difficulty: {
    name: '',
    data: []
  },
  supply: {
    name: '',
    data: []
  },

  // Transactions

  txns: {
    name: '',
    data: []
  },
  txFees: {
    name: '',
    prices: [],
    data: []
  }
})

export const mutations = {
  SET_TXNS(state, txns) {
    state.txns = txns
  },
  SET_GASPRICE(state, gasPrice) {
    state.gasPrice = gasPrice
  },
  SET_GASLIMIT(state, gasLimit) {
    state.gasLimit = gasLimit
  },
  SET_BLOCKS(state, blocks) {
    state.blocks = blocks
  },
  SET_BLOCKTIME(state, blockTime) {
    state.blockTime = blockTime
  },
  SET_DIFFICULTY(state, difficulty) {
    state.difficulty = difficulty
  },
  SET_SUPPLY(state, supply) {
    state.supply = supply
  },
  SET_TXFEES(state, txFees) {
    state.txFees = txFees
  },
  SET_FULL(state) {
    state.filled = true
  }
}

async function fetchNumberChart(name = '', limit = 0) {
  const {
    data: { result }
  } = await axios.post(process.env.config.apiUrl, {
    jsonrpc: '2.0',
    method: 'explorer_getNumberChart',
    params: [name, limit],
    id: 88
  })

  const { name: chartName, timestamps, series } = result

  const data = timestamps.map((val, idx) => {
    return { x: moment(val, 'MM/DD/YY').unix() * 1000, y: series[idx] }
  })

  return { name: chartName, data }
}

async function fetchNumberStringChart(name = '', limit = 0) {
  const {
    data: { result }
  } = await axios.post(process.env.config.apiUrl, {
    jsonrpc: '2.0',
    method: 'explorer_getNumberStringChart',
    params: [name, limit],
    id: 88
  })

  const { name: chartName, timestamps, series } = result

  const data = timestamps.map((val, idx) => {
    return { x: moment(val, 'MM/DD/YY').unix() * 1000, y: series[idx] }
  })

  return { name: chartName, data }
}
//
// function fetchMLChart(name = '') {
//   return axios.post(process.env.config.apiUrl, {
//     jsonrpc: '2.0',
//     method: 'explorer_getMLChart',
//     params: [name],
//     id: 88
//   })
// }

export const actions = {
  async fetchAll({ dispatch, commit }) {
    await dispatch('fetchGasPrice')
    await dispatch('fetchGasLimit')
    await dispatch('fetchBlocks')
    await dispatch('fetchBlocktimes')
    await dispatch('fetchDifficulty')
    await dispatch('fetchSupply')

    await dispatch('fetchTransactions')
    await dispatch('fetchTxFees')

    commit('SET_FULL')
  },

  // Blocks

  async fetchGasPrice({ commit }) {
    const chartData = await fetchNumberChart('avgGasPrice', 0)

    commit('SET_GASPRICE', chartData)
  },
  async fetchGasLimit({ commit }) {
    const chartData = await fetchNumberChart('gasLimit', 0)

    commit('SET_GASLIMIT', chartData)
  },
  async fetchBlocks({ commit }) {
    const chartData = await fetchNumberChart('blocks', 0)

    commit('SET_BLOCKS', chartData)
  },
  async fetchBlocktimes({ commit }) {
    const chartData = await fetchNumberChart('blockTime', 0)

    commit('SET_BLOCKTIME', chartData)
  },
  async fetchDifficulty({ commit }) {
    const chartData = await fetchNumberChart('difficulty', 0)

    commit('SET_DIFFICULTY', chartData)
  },
  async fetchSupply({ commit }) {
    const chartData = await fetchNumberStringChart('supply', 0)

    commit('SET_SUPPLY', chartData)
  },

  // Transactions
  async fetchTransactions({ commit }) {
    const chartData = await fetchNumberChart('transactions', 0)

    commit('SET_TXNS', chartData)
  },

  async fetchTxFees({ commit }) {
    const {
      data: { result }
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_getNumberStringChart',
      params: ['txFees', 0],
      id: 88
    })

    const { name: chartName, timestamps, series } = result

    // We fetch historical price data from coingecko to accurately value txfees.
    // If day show sup empty it's filled with the nearest day with price
    const { data: priceData } = await axios.get(
      `https://api.coingecko.com/api/v3/coins/ubiq/market_chart/range?vs_currency=usd&from=${moment(
        timestamps[0],
        'MM/DD/YY'
      ).unix()}&to=${moment(
        timestamps[timestamps.length - 1],
        'MM/DD/YY'
      ).unix()}`
    )

    const { prices } = priceData
    const map = new Map(prices)

    const getStamp = (ts) => moment(ts, 'MM/DD/YY').unix() * 1000

    const stampPrices = timestamps.map((val) => {
      const ts = getStamp(val)
      let price = 0

      if (map.has(ts)) {
        price = map.get(ts)
      } else {
        price = 0
      }
      return [ts, price]
    })

    let idx = 0

    for (const [ts, price] of stampPrices) {
      let currPrice = 0

      if (price === 0) {
        currPrice = stampPrices[idx - 1][1]
        stampPrices[idx] = [ts, currPrice]
      }
      idx++
    }

    const mapPrices = new Map(stampPrices)

    const data = timestamps.map((val, idx) => {
      const ts = moment(val, 'MM/DD/YY').unix() * 1000
      return {
        x: ts,
        y: common.mulFiat(common.fromWei(series[idx]), mapPrices.get(ts), 2)
      }
    })

    const chartData = { name: chartName, data, prices: stampPrices }

    commit('SET_TXFEES', chartData)
  }
}
