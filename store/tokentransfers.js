import axios from 'axios'
export const state = () => ({
  latest: [],
  total: 0
})

export const mutations = {
  SET_TRANSFERS(state, { txns, total }) {
    state.latest = txns
    state.total = total
  }
}

export const actions = {
  async fetchLatest({ commit }) {
    const { data } = await axios.get(
      process.env.config.apiUrl + '/latesttokentransfers/1000'
    )

    commit('SET_TRANSFERS', data)
  }
}
