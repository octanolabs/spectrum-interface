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
  fetchBlocks({ commit }) {
    axios
      .get(process.env.config.apiUrl + '/latestblocks/1000')
      .then((response) => {
        commit('SET_BLOCKS', response.data)
      })
  }
}
