import axios from 'axios'
export const state = () => ({
  latest: [],
  pending: [],
  failed: [],
  contractsDeployed: [],
  contractCalls: [],
  total: 0,
})

export const mutations = {
  SET_LATEST(state, { txns, total }) {
    state.latest = txns
    state.total = total
  },
  SET_PENDING(state, { result }) {
    state.pending = result.transactions
  },
  SET_FAILED(state, { txns, total }) {
    state.failed = txns
    state.total = total
  },
  SET_CONTRACTS(state, { txns, total }) {
    state.contracts = txns
    state.total = total
  },
  SET_CALLS(state, { txns, total }) {
    state.calls = txns
    state.total = total
  },
}

export const actions = {
  async fetchLatest({ commit }) {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestTransactions',
      params: [1000],
      id: 88,
    })

    commit('SET_LATEST', result)
  },
  async fetchPending({ commit }) {
    const { data } = await axios.post(process.env.config.rpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: ['pending', true],
      id: 1,
    })

    commit('SET_PENDING', data)
  },
  async fetchFailed({ commit }) {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestFailedTransactions',
      params: [1000],
      id: 88,
    })

    commit('SET_FAILED', result)
  },
  async fetchContracts({ commit }) {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestContractsDeployed',
      params: [1000],
      id: 88,
    })

    commit('SET_CONTRACTS', result)
  },
  async fetchCalls({ commit }) {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestContractCalls',
      params: [1000],
      id: 88,
    })

    commit('SET_CALLS', result)
  },
}
