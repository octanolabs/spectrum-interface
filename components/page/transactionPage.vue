<template>
  <!--  TODO: add stuff for pending transaction-->
  <data-view :item="transaction">
    <template v-slot:transaction.blockNumber="{ blockNumber }">
      <nuxt-link :to="{ name: 'block-id', params: { id: blockNumber } }">
        {{ blockNumber }}
      </nuxt-link>
      ({{ confirmations }} block confirmations)
    </template>
    <template v-slot:transaction.hash.key>
      TxHash:
    </template>
    <template v-slot:transaction.hash="{ hash }">
      {{ hash }}
    </template>
    <template v-slot:transaction.timestamp="{ timestamp }">
      {{ calcTime(timestamp) }}
    </template>
    <template v-slot:transaction.from="{ from }">
      <!--      TODO: add address link when impl-->
      <nuxt-link :to="{ name: 'Address', params: { hash: token.to } }">
        {{ from | shortenAddress }}
      </nuxt-link>
      {{ getAddressTag(from) }}
    </template>
    <template v-slot:transaction.to="{ to }">
      <!--      TODO: add address link when impl-->
      <nuxt-link :to="{ name: 'Address', params: { hash: token.to } }">
        {{ to | shortenAddress }}
      </nuxt-link>
      <template v-if="to">
        {{ getAddressTag(to) }}
      </template>
      <template v-else>
        null
      </template>
    </template>
    <template v-if="contractDeployed" v-slot:transaction.contractAddress.key>
      Contract Deployed:
    </template>
    <template
      v-if="contractDeployed"
      v-slot:transaction.contractAddress="{ contractAddress }"
    >
      {{ contractAddress }}
    </template>
    <template v-slot:transaction.value="{ value }">
      {{ fromWei(value) }} UBQ (${{ calcValue(fromWei(value), 2) }})
    </template>
    <template v-slot:transaction.gas.key>
      Gas Limit:
    </template>
    <template v-slot:transaction.gas="{ gas }">
      <template v-if="pending">
        {{ formatNumber(toDecimal(gas)) }}
      </template>
      <template v-else>
        {{ formatNumber(gas) }}
      </template>
    </template>
    <template v-slot:transaction.gasPrice="{ gasPrice }">
      {{ fromWeiToGwei(gasPrice) }} Gwei
    </template>
    <template v-slot:transaction.gasUsed.key>
      Gas Used By Txn:
    </template>
    <template v-slot:transaction.gasUsed="{ gasUsed }">
      {{ formatNumber(gasUsed) }}
    </template>
    <template v-slot:transaction.txFee.key>
      Actual Tx Cost/Fee:
    </template>
    <template v-slot:transaction.txFee="{ gasUsed, gasPrice }">
      {{ calcTxFee(gasUsed, gasPrice) }} UBQ (${{
        calcValue(calcTxFee(gasUsed, gasPrice), 4)
      }})
    </template>
    <template v-slot:transaction.nonce.key>
      Nonce & [Position]:
    </template>
    <template v-slot:transaction.nonce="{ nonce, transactionIndex: position }">
      {{ nonce }} [{{ position }}]
    </template>
    <template v-slot:transaction.status="{ status }">
      {{ status }}
    </template>
    <template v-slot:transaction.input.key>
      Input Data:
    </template>
    <template v-slot:transaction.input="{ input }">
      <template v-if="computedInputData">
        <input-data-card
          :input-data="inputData"
          :input-string="input"
          has-input-data
        />
      </template>
      <template v-else>
        <input-data-card :input-string="input" />
      </template>
    </template>
    <template v-if="tokenTransferred" v-slot:tokenTxn.tokenTransferred.key>
      Token Transferred:
    </template>
    <template v-if="tokenTransferred" v-slot:tokenTxn.tokenTransferred>
      <nuxt-link :to="{ name: 'Address', params: { hash: token.from } }">
        {{ token.from | shortenAddress }}
      </nuxt-link>
      To
      <nuxt-link :to="{ name: 'Address', params: { hash: token.to } }">
        {{ token.to | shortenAddress }}
      </nuxt-link>
      for {{ token.value }}
      <nuxt-link :to="{ name: 'Token', params: { hash: token.contract } }">
        {{ token.symbol }}
      </nuxt-link>
    </template>
    <template v-if="showLogs" v-slot:eventLogs.logs.key>
      Event Logs:
    </template>
    <template v-if="showLogs" v-slot:eventLogs.logs>
      <tx-logs-card :event-logs="eventLogs" />
    </template>
  </data-view>
</template>

<script>
import dataView from '~/components/util/DataView.vue'
import inputDataCard from '~/components/util/cards/inputDataCard.vue'
import txLogsCard from '~/components/util/cards/txLogsCard.vue'

import addresses from '~/scripts/addresses'
import common from '~/scripts/common'
import contracts from '~/scripts/contracts'
import tokens from '~/scripts/tokens'

export default {
  components: {
    dataView,
    inputDataCard,
    txLogsCard
  },
  filters: {
    shortenAddress(hash = '0x00000000000000000000000000000000') {
      return hash.substring(0, 17) + '...'
    }
  },
  props: {
    transaction: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    },
    pending: {
      type: Boolean,
      required: false,
      default: false
    },
    contractDeployed: {
      type: Boolean,
      required: false,
      default: false
    },
    priceUsd: {
      type: String,
      required: true,
      default: '0'
    },
    confirmations: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data() {
    return {
      refreshing: false,

      token: {},
      inputData: {},
      eventLogs: [],
      tokenTransferred: false,
      showLogs: false,
      computedInputData: false
    }
  },
  watch: {
    transaction() {
      if (this.transaction.logs.length > 0) {
        this.showLogs = true
        this.eventLogs = contracts.processEventLogs(this.transaction.logs)
      }
      if (this.transaction.input !== '0x') {
        this.inputData = contracts.processTxnInput(this.transaction.input)
        if (this.inputData.isKnown) {
          this.computedInputData = true
        }
        this.token = tokens.processInputData(this.transaction, this.inputData)
        if (this.token.isTokenTxn) {
          this.tokenTransferred = true
        }
      }
    }
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
    fromWei(val) {
      return common.fromWei(val)
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
      return common.mulFiat(ubq, this.priceUsd, decimals)
    }
  }
}
</script>
