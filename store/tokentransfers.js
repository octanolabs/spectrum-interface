import axios from 'axios'
export const state = () => ({
  latest: [],
  total: 0
})

export const mutations = {
  SET_TRANSFERS(state, { transfers, total }) {
    state.latest = transfers
    state.total = total
  }
}

export const actions = {
  async fetchLatest({ commit }) {
    const {
      data: { result }
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestTokenTransfers',
      params: [1000],
      id: 88
    })

    commit('SET_TRANSFERS', result)
  }
}
