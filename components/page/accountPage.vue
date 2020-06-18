<template>
  <div class="d-flex flex-column">
    <v-sheet>
      <data-view
        :item="{
          balance: store.balance,
          address: address,
          tokenBalances: store.tokenBalances,
          transactions: store.txnsTotal,
        }"
      >
        <template v-slot:overview.blockie.key="{ address: accountAddress }">
          <blockie :address="accountAddress" size="md" inline></blockie>
        </template>
        <template v-slot:overview.address.key="{ address: accountAddress }">
          Showing account {{ accountAddress }}
        </template>
        <template v-slot:overview.address="{ address: accountAddress }">
          <qrcode-modal :address="accountAddress" />
        </template>
        <template v-slot:overview.hr />
        <template v-slot:overview.balance="{ balance }">
          {{ fromWei(balance) }} UBQ
        </template>
        <template v-slot:overview.balance.key>
          Balance (UBQ)
        </template>
        <template v-slot:overview.balance_usd="{ balance }">
          {{ calcValue(balance, 'usd') }} $
        </template>
        <template v-slot:overview.balance_usd.key>
          Balance (USD)
        </template>
        <template v-slot:overview.transactions="{ transactions }">
          {{ formatNumber(transactions) }}
        </template>
        <template v-slot:tokens="{ tokenBalances }">
          <v-row>
            <v-col cols="3">
              <v-menu offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn dark v-on="on">
                    <span v-if="selectedToken !== null">
                      {{ selectedToken.balance }} {{ selectedToken.symbol }}
                    </span>
                    <span v-else>
                      Dropdown
                    </span>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in tokenBalances.filter(
                      (token) => token.balance !== '0'
                    )"
                    :key="index"
                    @click="selectedToken = item"
                  >
                    <v-list-item-title>
                      {{ item.balance }} {{ item.symbol }}
                    </v-list-item-title>
                    <v-list-item-content>{{ item.name }}</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </template>
      </data-view>
      <data-view :item="{ test: 'test' }" no-breadcrumbs>
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
        <template v-if="store.isContract" v-slot:contractCode>
          <v-card flat color="grey darken-4">
            <v-card-title>Contract Bytecode</v-card-title>
            <v-card-text>
              {{ store.contractData.contractByteCode }}
            </v-card-text>
          </v-card>
        </template>
      </data-view>
    </v-sheet>
  </div>
</template>

<script>
import DataView from '../util/DataView'
import common from '../../scripts/common'
import addresses from '../../scripts/addresses'
import tokens from '../../scripts/tokens'

import Blockie from '../util/misc/Blockie'
import qrcodeModal from '../util/misc/qrcodeModal'
import transfersTable from '~/components/tables/tokenTransfersTable'
import txnsTable from '~/components/tables/txnsTable'

export default {
  components: {
    qrcodeModal,
    Blockie,
    DataView,
    transfersTable,
    txnsTable,
  },
  props: {
    address: {
      type: String,
      required: true,
      default: '0x',
    },
    price: {
      type: Object,
      required: true,
      default: () => ({
        btc: '',
        usd: '',
        eur: '',
      }),
    },
    store: {
      type: Object,
      required: true,
      default: () => ({
        balance: '0',
        txns: [],
        txnsTotal: 0,
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
    }
  },
  methods: {
    getAddressTag(hash) {
      return addresses.getAddressTag(hash.toLowerCase()) || hash
    },
    getAddressTitle(hash) {
      const tag = addresses.getAddressTag(hash.toLowerCase())
      if (tag) {
        return '(' + tag + ')'
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
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    fromWei(val, roundTo) {
      return common.fromWei(val, roundTo)
    },
    calcValue(balance, currency = 'btc') {
      return common.mulFiat(common.fromWei(balance), this.price[currency], 2)
    },
    gettokens() {
      return tokens.tokens()
    },
  },
}
</script>
