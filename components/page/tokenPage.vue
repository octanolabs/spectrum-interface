<template>
  <div class="d-flex flex-column">
    <v-sheet>
      <data-view
        :item="{
          supply: store.supply,
          address: address,
          // tokenBalances: store.tokenBalances,
          transfersTotal: store.tokenTransfersTotal,
          contractData: store.contractData,
          token: store.token
        }"
      >
        <template v-slot:overview.blockie.key="{ address: accountAddress }">
          <blockie :address="accountAddress" size="md" inline></blockie>
        </template>
        <template
          v-slot:overview.address.key="{
            address: accountAddress,
            token: { name }
          }"
        >
          Showing token ({{ name }}) deployed at account {{ address }}
        </template>
        <template v-slot:overview.address="{ address: accountAddress }">
          <qrcode-modal :address="accountAddress" />
        </template>
        <template v-slot:overview.symbol="{ token: { symbol } }">
          {{ symbol }}
        </template>
        <template v-slot:overview.decimals="{ token: { decimals } }">
          {{ decimals }}
        </template>
        <template v-slot:overview.hr />
        <template v-slot:overview.supply="{ supply, token: { symbol } }">
          {{ supply }} {{ symbol }}
        </template>
        <template v-slot:overview.supply.key>
          <!-- TODO: eventually swap this for reusable popout component -->
          <v-menu top right transition="scale-transition" origin="bottom left">
            <template v-slot:activator="{ on }">
              Supply <v-icon small v-on="on">mdi-information</v-icon>
            </template>
            <v-card flat>
              <v-card-text class="text-wrap">
                <div class="d-block" style="width: 250px">
                  This value represents the total supply defined in the token
                  contract, it may not represent current circulating supply.'
                </div>
              </v-card-text>
            </v-card>
          </v-menu>
          :
        </template>
        <template v-slot:overview.balance_usd="{ balance }">
          {{ balance }} $
        </template>
        <template v-slot:overview.balance_usd.key>
          Balance (USD)
        </template>
        <template v-slot:overview.transactions="{ transfersTotal }">
          {{ formatNumber(transfersTotal) }}
        </template>
      </data-view>
      <data-view
        :item="{
          transfers: store.tokenTransfers,
          contract: store.contractData
        }"
        no-breadcrumbs
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
    </v-sheet>
  </div>
</template>

<script>
import DataView from '../util/DataView'
import addresses from '../../scripts/addresses'
import Blockie from '../util/misc/Blockie'
import qrcodeModal from '../util/misc/qrcodeModal'
import transfersTable from '~/components/tables/tokenTransfersTable'

export default {
  components: {
    Blockie,
    DataView,
    transfersTable,
    qrcodeModal
  },
  props: {
    address: {
      type: String,
      required: true,
      default: '0x'
    },
    price: {
      type: Object,
      required: true,
      default: () => ({
        btc: '',
        usd: '',
        eur: ''
      })
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
        symbol: ''
      })
    },
    loadingObject: {
      type: Object,
      default: () => ({
        balance: false,
        tokenBalances: false,
        transactions: false,
        tokenTransfers: false,
        contractData: false
      })
    }
  },
  data() {
    return {
      selectedToken: null
    }
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
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  }
}
</script>
