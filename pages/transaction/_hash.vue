<template>
  <v-col cols="12" class="pa-0">
    <breadcrumbSpinner v-bind="$attrs" no-loading />
    <v-tabs show-arrows v-model="tab">
      <v-tab>Overview</v-tab>
      <v-tab v-if="showLogs">
        Logs
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
                <v-chip v-if="txn.status" outlined label color="primary">
                  <v-icon class="pr-2">mdi-check-circle-outline</v-icon>
                  <strong>SUCCESS</strong>
                </v-chip>
                <v-chip v-else outlined label color="error">
                  <v-icon class="pr-2">mdi-alert-circle-outline</v-icon>
                  <strong>FAILED</strong>
                </v-chip>
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Block Number"
              tooltip="The number of the block in which the transaction was recorded. Block confirmation indicate how many blocks since the transaction is mined."
            >
              <template v-slot:subtitle>
                <nuxt-link
                  :to="{ name: 'block-id', params: { id: blockNumber } }"
                >
                  {{ txn.blockNumber }}
                </nuxt-link>
                ({{ confirmations }} block confirmations)
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Timestamp"
              tooltip="The date and time at which a transaction is mined."
            >
              <template v-slot:subtitle>
                {{ calcTime(txn.timestamp) }}
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="From"
              tooltip="The sending party of the transaction (could be from a contract address)."
            >
              <template v-slot:subtitle>
                <nuxt-link
                  :to="{
                    name: 'account-address',
                    params: { address: txn.from },
                  }"
                >
                  {{ txn.from }}
                </nuxt-link>
                {{ getAddressTag(txn.from) }}
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              v-if="!contractDeployed"
              title="Interacted With (To)"
              tooltip="The receiving party of the transaction (could be a contract address)."
            >
              <template v-slot:subtitle>
                <nuxt-link
                  :to="{
                    name: 'account-address',
                    params: { address: txn.to },
                  }"
                >
                  {{ txn.to }}
                </nuxt-link>
                {{ getAddressTag(txn.to) }}
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              v-else
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
                  {{ txn.contractAddress }}
                </nuxt-link>
                {{ getAddressTag(txn.contractAddress) }}
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              v-if="tokenTransferred"
              title="Token Transferred"
              tooltip="Token transferred in the transaction."
            >
              <template v-slot:subtitle>
                From
                <nuxt-link
                  :to="{ name: 'Address', params: { hash: token.from } }"
                >
                  {{ token.from | shortenAddress }}
                </nuxt-link>
                To
                <nuxt-link
                  :to="{ name: 'Address', params: { hash: token.to } }"
                >
                  {{ token.to | shortenAddress }}
                </nuxt-link>
                for {{ token.value }}
                <nuxt-link
                  :to="{ name: 'Token', params: { hash: token.contract } }"
                >
                  {{ token.symbol }}
                </nuxt-link>
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Value"
              tooltip="The value being transacted in UBQ and fiat value."
            >
              <template v-slot:subtitle>
                {{ fromWei(txn.value) }} UBQ (${{
                  calcValue(fromWei(txn.value), 6)
                }})
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Transaction Fee"
              tooltip="Amount paid to the miner for processing the transaction."
            >
              <template v-slot:subtitle>
                {{ txFee }} UBQ (${{ calcValue(txFee, 6) }})
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Gas Price"
              tooltip="Cost per unit of gas specified for the transaction, in gwei (2e-8 UBQ). The higher the gas price the higher chance of getting included in a block."
            >
              <template v-slot:subtitle>
                {{ fromWeiToGwei(txn.gasPrice) }} gwei
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Gas Limit"
              tooltip="Maximum amount of gas provided for the transaction. For normal UBQ transfers, the value is 21,000. For contracts this value is higher and bound by block gas limit."
            >
              <template v-slot:subtitle>
                {{ formatNumber(txn.gas) }}
              </template>
            </spectrum-list-item>
            <spectrum-list-item
              title="Gas Used by Transaction"
              tooltip="The exact units of gas that was used for the transaction."
            >
              <template v-slot:subtitle>
                {{ formatNumber(txn.gasUsed) }}
              </template>
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
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import SpectrumListItem from '~/components/util/misc/ListItem.vue'
import inputDataCard from '~/components/util/cards/inputDataCard.vue'
import txTraceCard from '~/components/util/cards/txTraceCard.vue'
import txLogsCard from '~/components/util/cards/txLogsCard.vue'
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
  },
  filters: {
    shortenAddress(hash = '0x00000000000000000000000000000000') {
      return hash.substring(0, 26) + '...'
    },
  },
  async middleware({ store }) {
    await store.dispatch('fetchPrices')
    await store.dispatch('fetchStats')
  },
  async fetch() {
    const [
      {
        data: { result: txn },
      },
      {
        data: { result: trace },
      },
    ] = await Promise.all([
      axios.post(process.env.config.apiUrl, {
        jsonrpc: '2.0',
        method: 'explorer_transactionByHash',
        params: [this.$route.params.hash],
        id: 88,
      }),
      axios.post(process.env.config.apiUrl, {
        jsonrpc: '2.0',
        method: 'explorer_txTrace',
        params: [this.$route.params.hash],
        id: 88,
      }),
    ])
    this.txn = txn
    this.txnTrace = trace
    console.log(trace)
    this.txFee = this.calcTxFee(this.txn.gasUsed, this.txn.gasPrice)
    if (this.txn.logs.length > 0) {
      this.showLogs = true
      this.eventLogs = contracts.processEventLogs(this.txn.logs)
    }
    if (this.txn.input !== '0x') {
      this.token = tokens.processInputData(this.txn, this.inputData)
      if (this.token.isTokenTxn) {
        this.tokenTransferred = true
      }
    }
  },
  data() {
    return {
      txFee: 0,
      txn: {},
      txnTrace: {},
      token: {},
      inputData: {},
      eventLogs: [],
      tokenTransferred: false,
      showLogs: false,
      computedInputData: false,
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
      return this.$store.state.prices.ubq.usd
    },
    deployedContract() {
      return this.txn.to === '' && !!this.txn.contractAddress
    },
  },
  watch: {
    $route() {
      this.$fetch()
    },
  },
  methods: {
    getAddressTag(hash) {
      const tag = addresses.getAddressTag(hash)
      if (tag) {
        return '(' + tag + ')'
      } else {
        return ''
      }
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
      if (val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return ''
      }
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
    processEventTopic(topic) {
      return contracts.processEventTopic(topic)
    },
    calcValue(ubq, decimals) {
      return common.mulFiat(ubq, this.priceUSD, decimals)
    },
  },
}
</script>
