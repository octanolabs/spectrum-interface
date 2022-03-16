import axios from 'axios'
import tokens from '~/scripts/tokens'
import common from '~/scripts/common'

export const getDefaultState = () => ({
  balance: '0',
  supply: '0',

  token: {},

  txns: [],
  txnsTotal: 0,

  itxns: [],
  itxnsTotal: 0,

  mined: [],
  minedTotal: 0,

  tokenTransfers: [],
  tokenTransfersTotal: 0,

  isContract: false,
  contractData: {},

  tokenBalances: [],
})

export const state = getDefaultState()

export const mutations = {
  CLEAR_STATE(state) {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN(state, payload) {
    state.token = payload
  },
  SET_SUPPLY(state, supply) {
    state.supply = supply
  },
  SET_BALANCE(state, balance) {
    state.balance = balance
  },
  SET_TRANSACTIONS(state, { txns, total }) {
    state.txns = txns
    state.txnsTotal = total
  },
  SET_ITRANSACTIONS(state, { itxns, total }) {
    state.itxns = itxns
    state.itxnsTotal = total
  },
  SET_MINED(state, { blocks, total }) {
    state.mined = blocks
    state.minedTotal = total
  },
  SET_TRANSFERS(state, { transfers, total }) {
    state.tokenTransfers = transfers
    state.tokenTransfersTotal = total
  },
  SET_CONTRACTDATA(state, contractData) {
    state.isContract = true
    state.contractData = contractData
  },
}
export const actions = {
  //
  // Tokens
  //
  clearState({ commit }) {
    commit('CLEAR_STATE')
  },
  async setToken({ commit }, address) {
    const { name, symbol, decimals } = tokens.getToken(address)

    await commit('SET_TOKEN', { name, symbol, decimals })
  },
  async fetchTokenSupply({ commit }, address) {
    const { data } = await axios.post(process.env.config.rpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: address,
          data: '0x18160ddd',
        },
        'latest',
      ],
      id: 2,
    })

    let supply = '-'

    if (data.result) {
      supply = tokens.toToken(common.hexToDecimal(data.result), address)
    }

    commit('SET_SUPPLY', supply)
  },
  async fetchTransfersOfToken({ commit }, address) {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestTransfersOfToken',
      params: [address],
      id: 88,
    })

    commit('SET_TRANSFERS', result)
  },

  //
  // Accounts
  //

  async fetchBalance({ commit }, address) {
    const {
      data: { result },
    } = await axios.post(process.env.config.rpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1,
    })

    commit('SET_BALANCE', common.hexToDecimal(result))
  },
  async fetchTransactions({ commit }, address) {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestTransactionsByAccount',
      params: [address],
      id: 88,
    })

    commit('SET_TRANSACTIONS', result)
  },
  async fetchITransactions({ commit }, address) {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestITransactionsByAccount',
      params: [address],
      id: 88,
    })

    commit('SET_ITRANSACTIONS', result)
  },
  async fetchMinedBlocks({ commit }, address) {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestMinedBlocks',
      params: [address, 100],
      id: 88,
    })

    commit('SET_MINED', result)
  },
  async fetchTokenTransfers({ commit }, address) {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_latestTokenTransfersByAccount',
      params: [address],
      id: 88,
    })

    commit('SET_TRANSFERS', result)
  },
  async fetchContractData({ commit }, address) {
    const {
      data: {
        result: {
          hash: contractDeployTxn,
          input: contractByteCode,
          from: contractDeployBy,
        },
      },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_transactionByContractAddress',
      params: [address],
      id: 88,
    })

    if (contractDeployTxn) {
      commit('SET_CONTRACTDATA', {
        contractDeployTxn,
        contractByteCode,
        contractDeployBy,
      })
    }
  },
}
