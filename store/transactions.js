import axios from 'axios'
export const state = () => ({
  latest: [],
  pending: [],
  total: 0
})

export const mutations = {
  SET_LATEST(state, { txns, total }) {
    state.latest = txns
    state.total = total
  },
  SET_PENDING(state, { result }) {
    state.pending = result.transactions
  }
}

export const actions = {
  async fetchLatest({ commit }) {
    const { data } = await axios.get(
      process.env.config.apiUrl + '/latesttransactions/1000'
    )

    commit('SET_LATEST', data)
  },
  async fetchPending({ commit }) {
    const { data } = await axios.post(
      process.env.config.rpcUrl,
      {
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: ['pending', true],
        id: 1
      },
      { headers: { 'Content-Type': 'application/json' } }
    )

    commit('SET_PENDING', data)
  }
}
