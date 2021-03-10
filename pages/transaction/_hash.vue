<template>
  <v-col cols="12" class="pa-0">
    <breadcrumbSpinner v-bind="$attrs" no-loading />
    <v-tabs v-model="tab" grow show-arrows>
      <v-tab>Overview</v-tab>
      <v-tab v-if="showLogs">
        Events
        <v-chip v-if="!!txn.logs" label small class="ml-1">
          {{ txn.logs.length }}
        </v-chip>
      </v-tab>
      <v-tab>Trace</v-tab>
      <v-tab-item eager>
        <v-col cols="12" calss="pa-1">
          <v-list dense>
            <spectrum-list-item
              title="Hash"
              tooltip="A TxHash or transaction hash is a unique 66 characters identifier that is generated whenever a transaction is executed."
            >
              <template v-slot:subtitle>
                {{ txn.hash }}
              </template>
              <template v-slot:action>
                <v-chip v-if="txn.status" small outlined label color="primary">
                  <v-icon class="pr-2" small>mdi-check-circle-outline</v-icon>
                  <strong>SUCCESS</strong>
                </v-chip>
                <v-chip v-else small outlined label color="error">
                  <v-icon class="pr-2" small>mdi-alert-circle-outline</v-icon>
                  <strong>FAILED</strong>
                </v-chip>
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Timestamp"
              tooltip="The number of the block in which the transaction was recorded. Block confirmation indicate how many blocks since the transaction is mined."
              three-line
            >
              <template v-slot:subtitle>
                {{ calcTimeTo(txn.timestamp) }}
              </template>
              <template v-slot:subtitle2>
                {{ calcTimeUTC(txn.timestamp) }}
              </template>
              <template v-slot:action>
                <nuxt-link
                  :to="{ name: 'block-id', params: { id: txn.blockNumber } }"
                >
                  <v-icon small class="mr">mdi-cube-outline</v-icon>
                  {{ txn.blockNumber }}
                </nuxt-link>
              </template>
              <template v-slot:action2>
                <strong>{{ confirmations }} CONFIRMATIONS</strong>
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="From"
              tooltip="The sending party of the transaction."
            >
              <template v-slot:subtitle>
                <v-avatar size="16">
                  <blockie :address="txn.from" size="xs" inline />
                </v-avatar>
                <nuxt-link
                  :to="{
                    name: 'account-address',
                    params: { address: txn.from },
                  }"
                >
                  {{ formatAddress(txn.from) }}
                </nuxt-link>
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Interacted with"
              tooltip="The receiving party of the transaction. May be a contract."
            >
              <template v-slot:subtitle>
                <v-avatar size="16">
                  <blockie :address="txn.to" size="xs" inline />
                </v-avatar>
                <nuxt-link
                  :to="{
                    name: 'account-address',
                    params: { address: txn.to },
                  }"
                >
                  {{ formatAddress(txn.to) }}
                </nuxt-link>
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              v-for="(token, index) of transfers"
              :key="index"
              :title="
                token.type === 'erc20'
                  ? 'Token ' + token.action
                  : 'Ubiq ' + token.action
              "
              :tooltip="
                'Asset ' +
                (token.action ? token.action.toLowerCase() : 'transferred') +
                ' in the transaction.'
              "
              three-line
            >
              <template v-if="token.action !== 'Minted'" v-slot:subtitle>
                <v-avatar size="16">
                  <blockie :address="token.from" size="xs" inline />
                </v-avatar>
                {{ fromPrefix(token.action) }}
                <nuxt-link
                  :to="{
                    name: 'account-address',
                    params: { address: token.from },
                  }"
                >
                  {{ formatAddress(token.from) }}
                </nuxt-link>
              </template>
              <template
                v-if="
                  token.action === 'Transferred' || token.action === 'Minted'
                "
                v-slot:subtitle2
              >
                <v-avatar size="16">
                  <blockie :address="token.to" size="xs" inline />
                </v-avatar>
                To
                <nuxt-link
                  :to="{
                    name: 'account-address',
                    params: { address: token.to },
                  }"
                >
                  {{ formatAddress(token.to) }}
                </nuxt-link>
              </template>
              <template v-slot:action>
                <v-row v-if="token.fetched" no-gutters>
                  <strong>
                    {{ nf.format(token.value) }}
                    <v-avatar size="16">
                      <v-img
                        :src="
                          'https://raw.githubusercontent.com/octanolabs/assets/master/blockchains/ubiq/assets/' +
                          token.checksumAddress +
                          '/logo.png'
                        "
                      >
                        <template v-slot:placeholder>
                          <blockie :address="token.contract" size="xs" inline />
                        </template>
                      </v-img>
                    </v-avatar>
                    <template v-if="token.type === 'erc20'">
                      <nuxt-link
                        :to="{
                          name: 'account-address',
                          params: { address: token.contract },
                        }"
                      >
                        {{ token.symbol }}
                      </nuxt-link>
                    </template>
                    <template v-else>
                      {{ token.symbol }}
                    </template>
                  </strong>
                </v-row>
                <v-row v-else no-gutters>
                  <v-icon>mdi-loading mdi-spin</v-icon>
                </v-row>
              </template>
              <template v-slot:action2>
                <v-row v-if="token.derivedUBQ && token.fetched" no-gutters>
                  ${{ nf.format(token.derivedUBQ) }}
                </v-row>
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              v-if="contractDeployed"
              title="Contract Deployed"
              tooltip="A contract was deployed to this address."
            >
              <template v-slot:subtitle>
                <nuxt-link
                  :to="{
                    name: 'account-address',
                    params: { address: txn.contractAddress },
                  }"
                >
                  {{ formatAddress(txn.contractAddress) }}
                </nuxt-link>
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Transaction Fee"
              tooltip="Amount paid to miner for processing the transaction."
              three-line
            >
              <template v-slot:subtitle>
                Gas Price <v-icon small>mdi-gas-station</v-icon>
                {{ fromWeiToGwei(txn.gasPrice) }} gwei
              </template>
              <template v-slot:subtitle2>
                Gas Used <v-icon small>mdi-fire</v-icon>
                {{ nf.format(txn.gasUsed) }}
              </template>
              <template v-slot:action>
                <v-row no-gutters>
                  <strong>
                    {{ txFee }}
                    <v-avatar size="16">
                      <v-img
                        :src="
                          'https://raw.githubusercontent.com/octanolabs/assets/master/blockchains/ubiq/assets/' +
                          '0x1FA6A37c64804C0D797bA6bC1955E50068FbF362' +
                          '/logo.png'
                        "
                      />
                    </v-avatar>
                    UBQ
                  </strong>
                </v-row>
              </template>
              <template v-slot:action2>
                <v-row v-if="priceUSD" no-gutters>
                  ${{ calcValue(txFee, 6) }}
                </v-row>
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Gas Limit"
              tooltip="Maximum amount of gas provided for the transaction. For normal UBQ transfers, the value is 21,000. For contracts this value is higher and bound by block gas limit."
            >
              <template v-slot:subtitle>
                {{ nf.format(txn.gas) }}
              </template>
              <template v-slot:action></template>
              <template v-slot:action2></template>
            </spectrum-list-item>
            <spectrum-list-item
              v-if="txn.nonce"
              title="Nonce"
              tooltip="Sequential running number for an address, beginning with 0 for the first transaction. For example, if the nonce of a transaction is 10, it would be the 11th transaction sent from the sender's address."
            >
              <template v-slot:subtitle>
                {{ toDecimal(txn.nonce) }}
              </template>
            </spectrum-list-item>
          </v-list>
          <input-data-card :input-string="txn.input" />
        </v-col>
      </v-tab-item>
      <v-tab-item v-if="showLogs">
        <tx-logs-card :event-logs="eventLogs" />
      </v-tab-item>
      <v-tab-item>
        <tx-trace-card :traces="[txnTrace]" />
      </v-tab-item>
    </v-tabs>
  </v-col>
</template>

<script>
import axios from 'axios'
import { ethers } from 'ethers'
import BigNumber from 'bignumber.js'
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import SpectrumListItem from '~/components/util/misc/ListItem.vue'
import inputDataCard from '~/components/util/cards/inputDataCard.vue'
import txTraceCard from '~/components/util/cards/txTraceCard.vue'
import txLogsCard from '~/components/util/cards/txLogsCard.vue'
import Blockie from '~/components/util/misc/Blockie'
import addresses from '~/scripts/addresses'
import contracts from '~/scripts/contracts'
import tokens from '~/scripts/tokens'
import common from '~/scripts/common'

export default {
  name: 'Transaction',
  components: {
    breadcrumbSpinner,
    SpectrumListItem,
    inputDataCard,
    txLogsCard,
    txTraceCard,
    Blockie,
  },
  async middleware({ store }) {
    await store.dispatch('fetchStats')
    await store.dispatch('tokens/getDefaultTokens')
    await store.dispatch('tokens/getShinobiTokens')
    await store.dispatch('tokens/getShinobiPairs')
  },
  async fetch() {
    const [
      {
        data: { result: txn },
      },
    ] = await Promise.all([
      axios.post(process.env.config.apiUrl, {
        jsonrpc: '2.0',
        method: 'explorer_transactionByHash',
        params: [this.$route.params.hash],
        id: 88,
      }),
    ])
    this.txn = txn
    this.txFee = this.calcTxFee(this.txn.gasUsed, this.txn.gasPrice)
    if (this.txn.logs.length > 0) {
      this.showLogs = true
      this.eventLogs = contracts.processEventLogs(this.txn.logs)
    }
    if (this.txn.input !== '0x') {
      this.inputData = contracts.processTxnInput(this.txn.input)
    }

    this.transfers = tokens.processInputData(this.txn, this.inputData)
    if (this.transfers) {
      const provider = new ethers.providers.JsonRpcProvider(
        'https://rpc.octano.dev'
      )
      const erc20Abi = [
        'function name() view returns (string)',
        'function symbol() view returns (string)',
        'function decimals() view returns (uint8)',
      ]

      for (const transfer of this.transfers) {
        if (transfer.type === 'erc20') {
          if (this.tokens[transfer.contract]) {
            // token info is already in state, use it.
            transfer.name = this.tokens[transfer.contract].name
            transfer.symbol = this.tokens[transfer.contract].symbol
            transfer.decimals = this.tokens[transfer.contract].decimals
            const decimals = new BigNumber(10).pow(
              this.tokens[transfer.contract].decimals
            )
            const value = transfer.value.div(decimals).toString()
            transfer.value = value
          } else {
            // fetch the info from the token contract itself.
            const tokenContract = new ethers.Contract(
              transfer.contract,
              erc20Abi,
              provider
            )
            transfer.name = await tokenContract.name()
            transfer.symbol = await tokenContract.symbol()
            transfer.decimals = await tokenContract.decimals()
            this.$store.dispatch('tokens/addERC20', transfer)
            const decimals = new BigNumber(10).pow(transfer.decimals)
            const value = new BigNumber(transfer.value).div(decimals).toString()
            transfer.value = value
          }
          transfer.checksumAddress = common.toChecksumAddress(transfer.contract)
          if (this.shinobiTokens[transfer.contract] && transfer.value) {
            transfer.derivedUBQ =
              this.shinobiTokens[transfer.contract].derivedETH *
              this.$store.state.tokens.ubqPrice *
              transfer.value

            transfer.derivedUBQ = transfer.derivedUBQ.toFixed(4)
          }
          transfer.fetched = true
        } else {
          // assume native for now
          transfer.decimals = 18
          const decimals = new BigNumber(10).pow(transfer.decimals)
          transfer.symbol = 'UBQ'
          transfer.name = 'Ubiq'
          transfer.value = new BigNumber(transfer.value)
            .div(decimals)
            .toString()
          transfer.checksumAddress =
            '0x1FA6A37c64804C0D797bA6bC1955E50068FbF362' // wubq hack
          transfer.derivedUBQ =
            this.$store.state.tokens.ubqPrice * transfer.value
          transfer.derivedUBQ = transfer.derivedUBQ.toFixed(4)
          transfer.fetched = true
        }
      }
    }
    const [
      {
        data: { result: trace },
      },
    ] = await Promise.all([
      axios.post(process.env.config.apiUrl, {
        jsonrpc: '2.0',
        method: 'explorer_txTrace',
        params: [this.$route.params.hash],
        id: 88,
      }),
    ])
    this.txnTrace = trace
  },
  data() {
    return {
      txFee: 0,
      txn: {},
      txnTrace: {},
      transfers: null,
      inputData: {},
      eventLogs: [],
      showLogs: false,
      computedInputData: false,
      tab: null,
      nf: new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 18,
      }),
    }
  },
  computed: {
    contractDeployed() {
      return this.txn.to === '' && !!this.txn.contractAddress
    },
    confirmations() {
      return this.pending === true
        ? 0
        : this.$store.state.stats.latestBlock.number - this.txn.blockNumber
    },
    latestBlock() {
      return this.$store.state.stats.latestBlock.number
    },
    priceUSD() {
      return this.$store.state.tokens.ubqPrice
    },
    deployedContract() {
      return this.txn.to === '' && !!this.txn.contractAddress
    },
    tokens() {
      return this.$store.state.tokens.erc20
    },
    shinobiTokens() {
      return this.$store.state.tokens.shinobi
    },
    shinobiPairs() {
      return this.$store.state.tokens.pairs
    },
  },
  watch: {
    $route() {
      this.$fetch()
    },
  },
  methods: {
    formatAddress(hash, len) {
      if (hash) {
        const name = addresses.getAddressTag(hash)
        if (name) {
          return name
        }
        /* if (this.tokens[hash]) {
          return this.tokens[hash].name
        }
        if (this.shinobiTokens[hash]) {
          return this.shinobiTokens[hash].name
        } */
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
    fromPrefix(action) {
      if (
        action === 'Wrapped' ||
        action === 'Burned' ||
        action === 'Unwrapped'
      ) {
        return 'By'
      } else {
        return 'From'
      }
    },
    calcTimeTo(timestamp) {
      return this.$moment().to(timestamp * 1000)
    },
    calcTimeUTC(timestamp) {
      return this.$moment.utc(timestamp * 1000).format('lll') + ' UTC'
    },
    fromWei(val, roundTo) {
      return common.fromWei(val, roundTo)
    },
    fromWeiToGwei(val) {
      return common.fromWeiToGwei(val)
    },
    calcTxFee(gasUsed, gasPrice) {
      return common.fromWei(common.calcTxFee(gasUsed, gasPrice))
    },
    toDecimal(hex) {
      return common.hexToDecimal(hex)
    },
    toUtf8(val) {
      return common.toUtf8(val)
    },
    calcValue(ubq, decimals) {
      return common.mulFiat(ubq, this.priceUSD, decimals)
    },
    toChecksumAddress(address) {
      return common.toChecksumAddress(address)
    },
  },
}
</script>
