import axios from 'axios'
export const state = () => ({
  blocks: [],
  total: 0
})

export const mutations = {
  SET_BLOCKS(state, { blocks, total }) {
    state.blocks = blocks
    state.total = total
  }
}

export const actions = {
  async fetchBlocks({ commit }) {
    const { data } = await axios.get(
      process.env.config.apiUrl + '/latestblocks/1000'
    )

    commit('SET_BLOCKS', data)
  }
}
