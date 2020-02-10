import axios from 'axios'
export const state = () => ({
  reorgs: [],
  canonicalBlocks: []
})

export const mutations = {
  SET_REORGS(state, reorgs) {
    state.reorgs = reorgs
  },
  SET_CANONICALBLOCKS(state, reorgs) {
    state.reorgs = reorgs
  }
}

export const actions = {
  async fetchReorgs({ commit }) {
    const { data } = await axios.get(
      process.env.config.apiUrl + '/latestforkedblocks/1000'
    )

    commit('SET_REORGS', data)
  },
  async fetchCanonicalBlocks({ commit, state }) {
    const reorgdBlockNumbers = state.reorgs.map(({ number }) => {
      return number
    })

    const canonicalBlocks = await Promise.all(
      reorgdBlockNumbers.map((number) => {
        return axios.get(process.env.config.apiUrl + `/block/${number}`)
      })
    )

    console.log(canonicalBlocks)
  }
}
