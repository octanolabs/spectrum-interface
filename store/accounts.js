import axios from 'axios'
export const state = () => ({
  richlist: [],
  latest: [],
  total: 0,
})

export const mutations = {
  SET_RICHLIST(state, { accounts, total }) {
    state.richlist = accounts
    state.total = total
  },
  SET_LATEST(state, { accounts, total }) {
    state.latest = accounts
    state.total = total
  },
}

export const actions = {
  async fetchByBalance({ commit }) {
    const {
      data: {
        result: { accounts, total },
      },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_accountsByBalance',
      params: [250],
      id: 88,
    })

    commit('SET_RICHLIST', { accounts, total })
  },
  async fetchByLastSeen({ commit }) {
    const {
      data: {
        result: { accounts, total },
      },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_accountsByLastSeen',
      params: [250],
      id: 88,
    })

    commit('SET_LATEST', { accounts, total })
  },
}
