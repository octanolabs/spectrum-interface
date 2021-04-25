<template>
  <div class="d-flex flex-column pa-0">
    <v-list class="pb-0 mb-0">
      <v-list-item style="border-bottom: 1px solid #272727">
        <v-list-item-avatar size="24">
          <blockie :address="address" size="sm" inline></blockie>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ toChecksumAddress(address) }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="getAddressTitle(address)">
            {{ getAddressTitle(address) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <qrcode-modal :address="address" />
        </v-list-item-action>
      </v-list-item>
      <v-list-item style="border-bottom: 1px solid #272727">
        <v-list-item-avatar size="24">
          <v-img
            :src="
              'https://raw.githubusercontent.com/octanolabs/assets/master/blockchains/ubiq/assets/' +
              '0x1FA6A37c64804C0D797bA6bC1955E50068FbF362' +
              '/logo.png'
            "
          />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ fromWei(store.balance) }} UBQ
          </v-list-item-title>
          <v-list-item-subtitle>
            ${{ nf.format((fromWei(store.balance) * price).toFixed(2)) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item style="border-bottom: 1px solid #272727">
        <v-list-item-avatar size="24">
          <v-icon size="24">mdi-diamond-stone</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>ERC20 Tokens</v-list-item-title>
          <v-list-item-subtitle>
            ${{ nf.format(totalERC20Value) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <token-balances-dialog :account="address" :balances="erc20Balances" />
        </v-list-item-action>
      </v-list-item>
      <v-list-item style="border-bottom: 1px solid #272727">
        <v-list-item-avatar tile size="24">
          <v-img :src="require('~/assets/shinobi.svg')" width="24" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Shinobi Liquidity</v-list-item-title>
          <v-list-item-subtitle>
            ${{ nf.format(totalShinobiLiquidity) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-row class="justify-center">
            <v-btn
              fab
              x-small
              color="primary"
              :disabled="totalShinobiPositions === 0"
              :href="'https://shinobi-info.ubiq.ninja/account/' + address"
              target="_blank"
            >
              {{ totalShinobiPositions }}
            </v-btn>
          </v-row>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <data-view :item="{ test: 'test' }" no-breadcrumbs no-title>
      <template v-slot:transactions>
        <txns-table
          no-breadcrumbs
          :transactions="store.txns"
          :total="store.txnsTotal"
          :loading="loadingObject.transactions"
          @refresh="$emit('refresh')"
        />
      </template>
      <template v-slot:tokenTransfers>
        <transfers-table
          no-breadcrumbs
          :transfers="store.tokenTransfers"
          :total="store.tokenTransfersTotal"
          :loading="loadingObject.tokenTransfers"
          @refresh="$emit('refresh')"
        />
      </template>
      <template v-if="store.minedTotal > 0" v-slot:minedBlocks>
        <blocks-table
          :blocks="store.mined"
          :total="store.minedTotal"
          :loading="loadingObject.mined"
          no-breadcrumbs
        />
      </template>
      <template v-if="store.isContract" v-slot:contractCode>
        <v-card flat color="grey darken-4">
          <v-card-title>Contract Bytecode</v-card-title>
          <v-card-text>
            {{ store.contractData.contractByteCode }}
          </v-card-text>
        </v-card>
      </template>
    </data-view>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'

import DataView from '../util/DataView'
import common from '../../scripts/common'
import addresses from '../../scripts/addresses'
import Blockie from '../util/misc/Blockie'
import qrcodeModal from '../util/misc/qrcodeModal'
import BlocksTable from '../tables/blocksTable'
import transfersTable from '~/components/tables/tokenTransfersTable'
import txnsTable from '~/components/tables/txnsTable'
import TokenBalancesDialog from '~/components/dialogs/TokenBalances'

export default {
  components: {
    BlocksTable,
    qrcodeModal,
    Blockie,
    DataView,
    transfersTable,
    txnsTable,
    TokenBalancesDialog,
  },
  props: {
    address: {
      type: String,
      required: true,
      default: '0x',
    },
    price: {
      type: String,
      required: true,
      default: () => '0',
    },
    store: {
      type: Object,
      required: true,
      default: () => ({
        balance: '0',
        txns: [],
        txnsTotal: 0,
        mined: [],
        minedTotal: 0,
        tokenTransfers: [],
        tokenTransfersTotal: 0,

        isContract: false,
        contractData: {},

        tokenBalances: [],
      }),
    },
    loadingObject: {
      type: Object,
      default: () => ({
        balance: false,
        tokenBalances: false,
        transactions: false,
        tokenTransfers: false,
        contractData: false,
      }),
    },
  },
  data() {
    return {
      selectedToken: null,
      erc20Balances: [],
      totalERC20Value: 0,
      totalShinobiLiquidity: 0,
      totalShinobiPositions: 0,
      nf: new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 18,
      }),
      errors: [],
    }
  },
  computed: {
    shinobiPairs() {
      return this.$store.state.tokens.pairs
    },
  },
  created() {
    this.getBalances()
    this.getLiquidityPositions()
  },
  methods: {
    async getLiquidityPositions() {
      const USER_POSITIONS = gql`
        query liquidityPositions($user: Bytes!) {
          liquidityPositions(where: { user: $user }) {
            pair {
              id
              reserve0
              reserve1
              reserveUSD
              token0 {
                id
                symbol
                derivedETH
              }
              token1 {
                id
                symbol
                derivedETH
              }
              totalSupply
            }
            liquidityTokenBalance
          }
        }
      `
      try {
        const client = new ApolloClient({
          link: new HttpLink({
            uri:
              'https://graphnode.octano.dev/subgraphs/name/octanolabs/shinobi',
          }),
          cache: new InMemoryCache(),
          shouldBatch: true,
        })
        let allFound = false
        let shinobiPositions = []
        const TOKENS_TO_FETCH = 100
        // shinobi tokens
        while (!allFound) {
          const result = await client.query({
            query: USER_POSITIONS,
            variables: {
              user: this.address,
            },
            fetchPolicy: 'cache-first',
          })
          shinobiPositions = shinobiPositions.concat(
            result?.data?.liquidityPositions
          )
          if (
            result?.data?.liquidityPositions?.length < TOKENS_TO_FETCH ||
            shinobiPositions.length > TOKENS_TO_FETCH
          ) {
            allFound = true
          }
        }

        let count = 0
        let totalShinobiLiquidity = new BigNumber(0)
        for (const i in shinobiPositions) {
          if (shinobiPositions[i].liquidityTokenBalance > 0) {
            const slpt = new BigNumber(
              shinobiPositions[i].liquidityTokenBalance
            )
            const totalSupply = new BigNumber(
              shinobiPositions[i].pair.totalSupply
            )
            const reserveUSD = new BigNumber(
              shinobiPositions[i].pair.reserveUSD
            )
            const value = slpt.div(totalSupply).multipliedBy(reserveUSD)
            totalShinobiLiquidity = totalShinobiLiquidity.plus(value)
            count = count + 1
          }
        }
        this.totalShinobiPositions = count
        this.totalShinobiLiquidity = totalShinobiLiquidity.toFixed(2)
      } catch (e) {
        this.errors.push(e)
      }
    },
    async getBalances() {
      const singleCallContractAddress =
        '0x068841237e0efcfbd3201f1f321fc915987d94e3'
      const provider = new ethers.providers.JsonRpcProvider(
        'https://rpc.octano.dev'
      )

      const singleCallAbi = [
        'function balances(address[], address[]) view returns (uint256[])',
      ]

      const singleCallContract = new ethers.Contract(
        singleCallContractAddress,
        singleCallAbi,
        provider
      )

      const addresses = [this.address]
      const tokens = Object.keys(this.$store.state.tokens.erc20)
      if (tokens.length > 0) {
        let totalERC20Value = new BigNumber(0)
        const hexBalances = await singleCallContract.balances(addresses, tokens)
        for (const b in hexBalances) {
          if (hexBalances[b].gt(0)) {
            const token = this.$store.state.tokens.erc20[tokens[b]]
            const decimals = new BigNumber(10).pow(token.decimals)
            const balance = new BigNumber(hexBalances[b].toString()).div(
              decimals
            )
            const ubqPrice = this.$store.state.tokens.ubqPrice
            const derivedUBQ = balance
              .multipliedBy(token.derivedETH)
              .multipliedBy(ubqPrice)
            totalERC20Value = totalERC20Value.plus(derivedUBQ)
            this.erc20Balances.push({
              address: common.toChecksumAddress(tokens[b]),
              name: token.name,
              symbol: token.symbol,
              balance: balance.toString(),
              value: derivedUBQ.toFixed(4),
            })
            this.totalERC20Value = totalERC20Value.toFixed(2)
          }
        }
      }
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash.toLowerCase()) || hash
    },
    getAddressTitle(hash) {
      const tag = addresses.getAddressTag(hash.toLowerCase())
      if (tag) {
        return tag
      } else {
        return ''
      }
    },
    calcGasUsed(gasUsed, gasLimit) {
      return ((gasUsed / gasLimit) * 100).toFixed(2) + '%'
    },
    calcTime(timestamp) {
      return (
        this.$moment().to(timestamp * 1000) +
        ' (' +
        this.$moment.utc(timestamp * 1000).format('lll') +
        ' UTC)'
      )
    },
    formatNumber(val) {
      return common.formatNumber(val)
    },
    fromWei(val, roundTo) {
      return common.fromWei(val, roundTo)
    },
    calcValue(balance, currency = 'btc') {
      return common.mulFiat(balance, 'usd', 2)
    },
    toChecksumAddress(hash) {
      return common.toChecksumAddress(hash)
    },
    formatAddress(hash, len) {
      if (hash) {
        const name = addresses.getAddressTag(hash)
        if (name) {
          return name
        }
        if (this.shinobiPairs[hash]) {
          return (
            'Shinobi (' +
            this.shinobiPairs[hash].token0.symbol +
            '/' +
            this.shinobiPairs[hash].token1.symbol +
            ')'
          )
        }

        let account = common.toChecksumAddress(hash)
        if (len) {
          account = account.substr(0, len)
        }
        return account
      }
    },
  },
}
</script>
