import axios from 'axios'
export const state = () => ({
  forkedblocks: []
})

export const mutations = {
  SET_FORKEDBLOCKS(state, forkedblocks) {
    state.forkedblocks = forkedblocks
  }
}

export const actions = {
  async fetchForkedBlocks({ commit }) {
    const { data } = await axios.get(
      process.env.config.apiUrl + '/latestforkedblocks/1000'
    )

    const forkedBlocks = await Promise.all(
      data.map(async (forked) => {
        const { data: block } = await axios.get(
          process.env.config.apiUrl + `/block/${forked.number}`
        )

        const { status } = await axios.get(
          process.env.config.apiUrl + `/uncle/${forked.hash}`
        )
        forked.includedAsUncle = status === 200
        forked.canonicalblock = block
        return forked
      })
    )

    commit('SET_FORKEDBLOCKS', forkedBlocks)
  }
}
