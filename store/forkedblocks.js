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
      data: { forkedBlocks, total }
    } = await axios.get(process.env.config.apiUrl + '/latestforkedblocks/1000')

    await Promise.all(
      forkedBlocks.map(async (forked) => {
        const { data: block } = await axios.get(
          process.env.config.apiUrl + `/block/${forked.number}`
        )

        // TODO: add another check, statusCode od 200 is too weak
        const { status } = await axios.get(
          process.env.config.apiUrl + `/uncle/${forked.hash}`
        )
        forked.includedAsUncle = status === 200
        forked.canonicalblock = block
        return forked
      })
    )

    commit('SET_FORKEDBLOCKS', { forkedBlocks, total })
  }
}
