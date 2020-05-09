import axios from 'axios'
export const state = () => ({
  forkedBlocks: [],
  total: 0
})

export const mutations = {
  SET_FORKEDBLOCKS(state, { forkedBlocks, total }) {
    state.forkedBlocks = forkedBlocks
    state.total = total
  }
}

export const actions = {
  async fetchForkedBlocks({ commit }) {
    const {
      data: {
        result: { forkedBlocks, total }
      }
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestForkedBlocks',
      params: [1000],
      id: 88
    })

    await Promise.all(
      forkedBlocks.map(async (forked) => {
        const {
          data: { result: block }
        } = await axios.post(process.env.config.apiUrl, {
          jsonrpc: '2.0',
          method: 'explorer_blockByNumber',
          params: [forked.number],
          id: 88
        })

        const {
          data: { result: uncle }
        } = await axios.post(process.env.config.apiUrl, {
          jsonrpc: '2.0',
          method: 'explorer_uncleByHash',
          params: [forked.hash],
          id: 88
        })

        forked.includedAsUncle = !!uncle.hash
        forked.canonicalblock = block
        return forked
      })
    )

    commit('SET_FORKEDBLOCKS', { forkedBlocks, total })
  }
}
