<template>
  <div class="d-flex flex-column pa-0">
    <v-list class="pb-0 mb-0">
      <v-list-item style="border-bottom: 1px solid #272727">
        <v-list-item-avatar size="24">
          <v-img
            :src="
              'https://raw.githubusercontent.com/octanolabs/assets/master/blockchains/ubiq/assets/' +
              toChecksumAddress(address) +
              '/logo.png'
            "
          >
            <template v-slot:placeholder>
              <blockie :address="address" size="sm" inline />
            </template>
          </v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ toChecksumAddress(address) }}
          </v-list-item-title>
          <v-list-item-subtitle v-if="token">
            {{ token.name }} - {{ token.symbol }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <qrcode-modal :address="address" />
        </v-list-item-action>
      </v-list-item>
      <v-list-item style="border-bottom: 1px solid #272727">
        <v-list-item-avatar tile size="24">
          <v-img :src="require('~/assets/shinobi.svg')" width="24" />
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Price</v-list-item-title>
          <v-list-item-subtitle>${{ price.toFixed(4) }}</v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-row class="justify-center">
            <v-btn
              fab
              x-small
              color="primary"
              :href="'https://shinobi-info.ubiq.ninja/token/' + address"
              target="_blank"
            >
              <v-icon small>mdi-arrow-right</v-icon>
            </v-btn>
          </v-row>
        </v-list-item-action>
      </v-list-item>
      <v-list-item style="border-bottom: 1px solid #272727">
        <v-list-item-avatar size="24" tile>
          <v-icon size="24">mdi-cash-multiple</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Total {{ token.symbol }}</v-list-item-title>
          <v-list-item-subtitle>
            {{ nf.format(totalSupply.toString()) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">
                mdi-information-outline
              </v-icon>
            </template>
            <span>
              Total supply returned by token contract. May not reflect
              circulating supply.
            </span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
      <v-list-item style="border-bottom: 1px solid #272727">
        <v-list-item-avatar size="24" tile>
          <v-icon size="24">mdi-chart-line</v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>Market Cap</v-list-item-title>
          <v-list-item-subtitle>
            ${{ nf.format(marketcap.toFixed(0)) }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-tooltip right>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on">
                mdi-information-outline
              </v-icon>
            </template>
            <span>
              This marketcap is calculated using total supply returned by token
              contract. It may not reflect marketcap calculated using
              circulating supply.
            </span>
          </v-tooltip>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <data-view
      :item="{
        transfers: store.tokenTransfers,
        contract: store.contractData,
      }"
      no-breadcrumbs
      no-title
    >
      <template v-slot:tokenTransfers="{ transfers }">
        <transfers-table
          no-breadcrumbs
          :transfers="transfers"
          :total="store.tokenTransfersTotal"
          :loading="loadingObject.tokenTransfers"
          @refresh="$emit('refresh')"
        />
      </template>
      <template v-slot:contractCode="{ contract }">
        <v-card flat color="grey darken-4">
          <v-card-title>Contract Bytecode</v-card-title>
          <v-card-text>
            {{ contract.contractByteCode }}
          </v-card-text>
        </v-card>
      </template>
    </data-view>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'

import DataView from '../util/DataView'
import addresses from '../../scripts/addresses'
import Blockie from '../util/misc/Blockie'
import qrcodeModal from '../util/misc/qrcodeModal'
import common from '../../scripts/common'
import transfersTable from '~/components/tables/tokenTransfersTable'

export default {
  components: {
    Blockie,
    DataView,
    transfersTable,
    qrcodeModal,
  },
  props: {
    address: {
      type: String,
      required: true,
      default: '0x',
    },
    token: {
      type: Object,
      required: true,
      default: () => null,
    },
    store: {
      type: Object,
      required: true,
      default: () => ({
        tokenTransfers: [],
        tokenTransfersTotal: 0,
        contractData: {},
        supply: '',
        name: '',
        symbol: '',
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
      totalSupply: new BigNumber(0),
      nf: new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 18,
      }),
    }
  },
  computed: {
    price() {
      return this.token.derivedETH * this.$store.state.tokens.ubqPrice
    },
    marketcap() {
      return this.totalSupply.times(this.price)
    },
  },
  created() {
    this.getTokenSupply(this.address)
  },
  methods: {
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash
    },
    getAddressTitle(hash) {
      const tag = addresses.getAddressTag(hash)
      if (tag) {
        return '(' + tag + ')'
      } else {
        return ''
      }
    },
    formatNumber(val) {
      return common.formatNumber(val)
    },
    calcMarketcap(supply, val) {
      return common.calcMarketcap(supply, val)
    },
    toChecksumAddress(hash) {
      return common.toChecksumAddress(hash)
    },
    fromWei(val, roundTo) {
      return common.fromWei(val, roundTo)
    },
    async getTokenSupply(address) {
      if (address) {
        const provider = await new ethers.providers.JsonRpcProvider(
          'https://rpc.octano.dev'
        )
        const erc20Abi = ['function totalSupply() view returns (uint256)']
        const tokenContract = await new ethers.Contract(
          address,
          erc20Abi,
          provider
        )
        const ts = await tokenContract.totalSupply()
        if (ts) {
          const bn = new BigNumber(ts.toString())
          const decimals = new BigNumber(10).pow(this.token.decimals)
          const totalSupply = new BigNumber(bn).div(decimals)
          this.totalSupply = totalSupply
          console.log(bn.toString())
        } else {
          console.log('womp womp')
        }
      }
    },
  },
}
</script>
