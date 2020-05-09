import axios from 'axios'
export const state = () => ({
  uncles: [],
  total: 0
})

export const mutations = {
  SET_UNCLES(state, { uncles, total }) {
    state.uncles = uncles
    state.total = total
  }
}

export const actions = {
  async fetchUncles({ commit }) {
    const {
      data: { result }
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestUncles',
      params: [1000],
      id: 88
    })
    commit('SET_UNCLES', result)
  }
}
