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
  fetchIndexState({ commit }) {
    let d = {}
    const price = {
      btc: '',
      usd: '',
      eur: ''
    }
    axios
      .get(process.env.config.apiUrl + '/status')
      .then((res) => {
        d = { ...res.data }
        return axios.get('https://api.coindesk.com/v1/bpi/currentprice.json')
      })
      .then((res) => {
        price.btc = d.price
        price.eur = common.mulFiat(
          d.price,
          res.data.bpi.EUR.rate.replace(',', '')
        )
        price.usd = common.mulFiat(
          d.price,
          res.data.bpi.USD.rate.replace(',', '')
        )
        commit('SET_STATS', { ...d, price })
      })
  },
  fetchChainSummary({ commit }) {
    const summary = {}
    axios
      .get(process.env.config.apiUrl + '/latesttransactions/12')
      .then((response) => {
        summary.txns = response.data.txns
        summary.txnCount = response.data.total
        return axios.get(process.env.config.apiUrl + '/latestblocks/12')
      })
      .then((response) => {
        summary.blocks = response.data.blocks
        summary.difficulty = common.toTH(summary.blocks[0].difficulty, 2) // (TH)
        summary.blocktime =
          summary.blocks[0].timestamp - summary.blocks[1].timestamp

        // calc avg blocktime based on latest blocks
        const blocktimes = []

        let sum = 0
        let count = 0

        summary.blocks.forEach(function(block) {
          if (summary.blocks[count + 1]) {
            const btime = block.timestamp - summary.blocks[count + 1].timestamp
            blocktimes.push(btime)
            sum += btime
            count += 1
          }
        })
        const avgBlocktime = sum / blocktimes.length

        // estimate hashrate based on avg blocktime (GH/s)
        summary.hashrate = (
          summary.blocks[0].difficulty /
          avgBlocktime /
          1000000000
        ).toFixed(2)
        commit('SET_SUMMARY', { ...summary })
      })
  }
}
