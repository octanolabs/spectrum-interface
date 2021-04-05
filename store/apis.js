function newEmptyApiSchema() {
  return {
    document: {
      schema: {},
      deref: {},
    },
    selected: 0, // selected methodId,
    error: false, // json parse error
  }
}
// export const getDefaultState = () => ({
export const state = () => ({
  drawers: {
    right: true,
  },
  spectrum: {
    openrpc: newEmptyApiSchema(),
    info: {
      title: 'ubiqscan',
      desc: 'Ubiqscan API',
      url: 'https://api.ubiqscan.io/v4/',
    },
  },
  gubiq: {
    openrpc: newEmptyApiSchema(),
    info: {
      title: 'gubiq',
      desc: 'Go-ubiq API',
      url: 'https://rpc.octano.dev/',
    },
  },
})

export const mutations = {
  SET_SELECTED_METHOD(state, payload) {
    state[payload.apiId].openrpc.selected = payload.method
  },
  TOGGLE_DRAWER(state) {
    state.drawers.right = !state.drawers.right
  },
  SET_OPENRPC_DOC(state, payload) {
    state[payload.apiId].openrpc.document = payload
  },
}

export const actions = {
  setSelectedMethod({ commit }, payload) {
    commit('SET_SELECTED_METHOD', payload)
  },
  toggleDrawer({ commit }) {
    commit('TOGGLE_DRAWER')
  },
  setOpenRpcDocument({ commit }, payload) {
    commit('SET_OPENRPC_DOC', payload)
  },
}
