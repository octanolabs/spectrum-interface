import axios from 'axios'
import tokens from '~/scripts/tokens'
import common from '~/scripts/common'

export const state = () => ({
  balance: '0',
  supply: '0',

  token: {},

  txns: [],
  txnsTotal: 0,

  tokenTransfers: [],
  tokenTransfersTotal: 0,

  isContract: false,
  contractData: {},

  tokenBalances: []
})

export const mutations = {
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
  SET_TRANSFERS(state, { transfers, total }) {
    state.tokenTransfers = transfers
    state.tokenTransfersTotal = total
  },
  SET_CONTRACTDATA(state, contractData) {
    state.isContract = true
    state.contractData = contractData
  },
  SET_TOKENBALANCES(state, tokenBalances) {
    state.tokenBalances = tokenBalances
  }
}
export const actions = {
  //
  // Tokens
  //
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
          data: '0x18160ddd'
        },
        'latest'
      ],
      id: 2
    })

    let supply = '-'

    if (data.result) {
      supply = tokens.toToken(common.hexToDecimal(data.result), address)
    }

    commit('SET_SUPPLY', supply)
  },
  async fetchTransfersOfToken({ commit }, address) {
    const { data: result } = await axios.get(
      process.env.config.apiUrl + '/latesttransfersbytoken/' + address
    )
    commit('SET_TRANSFERS', result)
  },
  //
  // Accounts
  //
  async fetchBalance({ commit }, address) {
    const {
      data: { result }
    } = await axios.post(process.env.config.rpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: 1
    })

    commit('SET_BALANCE', common.hexToDecimal(result))
  },
  async fetchTransactions({ commit }, address) {
    const { data: result } = await axios.get(
      process.env.config.apiUrl + '/latestaccounttxns/' + address
    )

    commit('SET_TRANSACTIONS', result)
  },
  async fetchTokenTransfers({ commit }, address) {
    const { data: result } = await axios.get(
      process.env.config.apiUrl + '/latestaccounttokentxns/' + address
    )
    commit('SET_TRANSFERS', result)
  },
  async fetchContractData({ commit }, address) {
    const {
      data: {
        hash: contractDeployTxn,
        input: contractByteCode,
        from: contractDeployBy
      }
    } = await axios.get(
      process.env.config.apiUrl + '/transactionbycontract/' + address
    )
    if (contractDeployTxn) {
      commit('SET_CONTRACTDATA', {
        contractDeployTxn,
        contractByteCode,
        contractDeployBy
      })
    }
  },
  async fetchTokenBalances({ commit }, address) {
    const tokenList = tokens.getTokens()

    const tokenBalances = await Promise.all(
      Object.keys(tokenList).map(async (contract) => {
        const {
          data: { result }
        } = await axios.post(process.env.config.rpcUrl, {
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [
            {
              to: contract,
              data: '0x70a08231' + tokens.zeroPadAddress(address)
            },
            'latest'
          ],
          id: 88
        })

        return {
          name: tokenList[contract].name,
          symbol: tokenList[contract].symbol,
          balance: tokens.toBalance(result, contract)
        }
      })
    )

    commit('SET_TOKENBALANCES', tokenBalances)
  }
}
