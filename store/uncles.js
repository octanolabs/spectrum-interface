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
    const { data } = await axios.get(
      process.env.config.apiUrl + '/latestuncles/1000'
    )

    commit('SET_UNCLES', data)
  }
}
