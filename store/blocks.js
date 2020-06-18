import axios from 'axios'
export const state = () => ({
  blocks: [],
  total: 0,
})

export const mutations = {
  SET_BLOCKS(state, { blocks, total }) {
    state.blocks = blocks
    state.total = total
  },
}

export const actions = {
  async fetchBlocks({ commit }) {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestBlocks',
      params: [1000],
      id: 88,
    })

    commit('SET_BLOCKS', result)
  },
}
