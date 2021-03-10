import axios from 'axios'
import moment from 'moment'
import consola from 'consola'
import common from '../scripts/common'

export const state = () => ({
  filled: false,
  // Blocks
  gasPrice: {
    name: '',
    data: [],
  },
  gasLimit: {
    name: '',
    data: [],
  },
  blocks: {
    name: '',
    data: [],
  },
  blockTime: {
    name: '',
    data: [],
  },
  difficulty: {
    name: '',
    data: [],
  },
  supply: {
    name: '',
    data: [],
  },

  // Transactions

  txns: {
    name: '',
    data: [],
  },
  txFees: {
    name: '',
    prices: [],
    data: [],
  },
  values: {
    name: '',
    data: [],
  },
  gasUsed: {
    name: '',
    data: [],
  },
  gasPriceLevels: {
    name: '',
    data: [],
  },
  gasUsedLevels: {
    name: '',
    data: [],
  },
  gasLevels: {
    name: '',
    data: [],
  },
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
  SET_VALUES(state, values) {
    state.values = values
  },
  SET_GASUSED(state, gasUsed) {
    state.gasUsed = gasUsed
  },
  SET_GASPRICELEVELS(state, gasPriceLevels) {
    state.gasPriceLevels = gasPriceLevels
  },
  SET_GASUSEDLEVELS(state, gasUsedLevels) {
    state.gasUsedLevels = gasUsedLevels
  },
  SET_GASLEVELS(state, gasLevels) {
    state.gasLevels = gasLevels
  },

  SET_FULL(state) {
    state.filled = true
  },
}

async function fetchNumberChart(name = '', limit = 0) {
  const {
    data: { result },
  } = await axios.post(process.env.config.apiUrl, {
    jsonrpc: '2.0',
    method: 'explorer_getNumberChart',
    params: [name, limit],
    id: 88,
  })

  const { name: chartName, timestamps, series } = result

  const data = timestamps.map((val, idx) => {
    return { x: moment(val, 'MM/DD/YY').unix() * 1000, y: series[idx] }
  })

  return { name: chartName, data }
}

async function fetchNumberStringChart(name = '', limit = 0) {
  const {
    data: { result },
  } = await axios.post(process.env.config.apiUrl, {
    jsonrpc: '2.0',
    method: 'explorer_getNumberStringChart',
    params: [name, limit],
    id: 88,
  })

  const { name: chartName, timestamps, series } = result

  const data = timestamps.map((val, idx) => {
    return { x: moment(val, 'MM/DD/YY').unix() * 1000, y: series[idx] }
  })

  return { name: chartName, data }
}

async function fetchMultiSeriesChart(name) {
  const {
    data: { result },
  } = await axios.post(process.env.config.apiUrl, {
    jsonrpc: '2.0',
    method: 'explorer_getMultiSeriesChart',
    params: [name, 0],
    id: 88,
  })

  const data = []

  const { name: chartName, timestamps, datasets } = result
  consola.log('datasets')
  consola.log(datasets)
  for (let i = 0; i < datasets.length / 88; i++) {
    const obj = {
      name: '',
      data: [],
      timestamps: [],
    }

    let to = ''

    const item = new Map()

    const from = datasets[i * 88].name
    for (
      let j = 0;
      i * 88 + j < datasets.length ? j < 88 : j < datasets.length % 88;
      j++
    ) {
      const idx = i * 88 + j
      to = datasets[idx].name
      const map = new Map(
        datasets[idx].series.map((val, index) => {
          return [datasets[idx].timestamps[index], val]
        })
      )

      for (const [ts, val] of map) {
        if (item.has(ts)) {
          item.set(ts, item.get(ts) + val)
        } else {
          item.set(ts, val)
        }
      }
    }
    obj.name = `${from}-${to}`
    // obj.data = Array.from(item).map(([k, v]) => {
    //   return {
    //     // x: moment(k, 'MM/DD/YY').unix() * 1000,
    //     x: k,
    //     y: v,
    //   }
    // })

    obj.data = timestamps.map((ts) => {
      return {
        x: moment(ts, 'MM/DD/YY').unix() * 1000,
        y: item.has(ts) ? item.get(ts) : 0,
      }
    })

    data.push(obj)
  }

  // for (const { name, series, timestamps } of datasets) {
  //   const values = []
  //   for (let i = 0; i < timestamps.length; i++) {
  //     values.push({
  //       x: moment(timestamps[i], 'MM/DD/YY').unix() * 1000,
  //       y: series[i],
  //     })
  //   }
  //   data.push({ name, data: values })
  // }

  return { name: chartName, data }
}
export const actions = {
  async fetchAll({ dispatch, commit }) {
    await dispatch('fetchGasPrice')
    await dispatch('fetchBlocks')
    await dispatch('fetchGasLimit')
    await dispatch('fetchBlocktimes')
    await dispatch('fetchDifficulty')
    await dispatch('fetchSupply')

    await dispatch('fetchTransactions')
    await dispatch('fetchTxFees')
    await dispatch('fetchGasUsed')
    // await dispatch('fetchValues')
    await dispatch('fetchGasPriceLevels')
    await dispatch('fetchGasUsedLevels')
    await dispatch('fetchGasLevels')

    commit('SET_FULL')
  },

  // Blocks

  async fetchGasPrice({ commit }) {
    const chartData = await fetchNumberChart('avgGasPrice', 0)

    commit('SET_GASPRICE', chartData)
  },
  async fetchBlocks({ commit }) {
    const chartData = await fetchNumberChart('blocks', 0)

    commit('SET_BLOCKS', chartData)
  },
  async fetchGasLimit({ commit, state }) {
    const chartData = await fetchNumberChart('gasLimit', 0)

    chartData.data = chartData.data.map(({ x, y }, idx) => {
      return { x, y: y * state.blocks.data[idx].y }
    })

    commit('SET_GASLIMIT', chartData)
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
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_getNumberStringChart',
      params: ['txFees', 0],
      id: 88,
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

    const map = new Map(priceData.prices)

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

    // const mapPrices = new Map(stampPrices)

    const data = timestamps.map((val, idx) => {
      const ts = moment(val, 'MM/DD/YY').unix() * 1000
      return {
        x: ts,
        y: common.fromWei(series[idx], 2),
      }
    })

    const prices = timestamps.map((val, idx) => {
      return {
        x: stampPrices[idx][0],
        y: stampPrices[idx][1],
      }
    })

    const chartData = { name: chartName, data, prices }

    commit('SET_TXFEES', chartData)
  },
  async fetchGasUsed({ commit }) {
    const chartData = await fetchNumberStringChart('gasUsed', 0)
    commit('SET_GASUSED', chartData)
  },
  /* async fetchValues({ commit }) {
    const chartData = await fetchNumberStringChart('values', 0)
    commit('SET_VALUES', chartData)
  }, */

  async fetchGasPriceLevels({ commit }) {
    const chartData = await fetchMultiSeriesChart('gasPriceLevels')
    commit('SET_GASPRICELEVELS', chartData)
  },
  async fetchGasUsedLevels({ commit }) {
    const chartData = await fetchMultiSeriesChart('gasUsedLevels')
    commit('SET_GASUSEDLEVELS', chartData)
  },
  async fetchGasLevels({ commit }) {
    const chartData = await fetchMultiSeriesChart('gasLevels')
    commit('SET_GASLEVELS', chartData)
  },
}
