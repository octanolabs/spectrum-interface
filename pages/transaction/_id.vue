<template>
  <v-row class="justify-content-md-center">
    <v-col md="10">
      <v-breadcrumbs>
        <v-breadcrumbs-item :to="{ name: 'Home' }">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item
          :to="{ name: 'Transactions', params: { type: 'latest' } }"
          >Transactions</v-breadcrumbs-item
        >
        <v-breadcrumbs-item active>{{ hash }}</v-breadcrumbs-item>
        <v-breadcrumbs-link>
          <b-button
            :class="{
              fa: true,
              'fa-refresh': true,
              'fa-spin': refreshing,
              'btn-breadcrumb': true
            }"
            v-on:click="fetch()"
          ></b-button>
        </v-breadcrumbs-link>
      </v-breadcrumbs>
      <b-tabs class="account-txn-tabs">
        <b-tab title="Overview" active>
          <v-card v-if="notfound" no-body class="block-card tav-card">
            <b-alert show variant="danger"
              >Sorry, we are unable to locate this transaction hash</b-alert
            >
          </v-card>
          <v-card v-if="notfound === false" no-body class="block-card tav-card">
            <v-row class="card-row">
              <v-col md="3">
                TxHash:
              </v-col>
              <v-col md="9">
                {{ hash }}
              </v-col>
            </v-row>
            <v-row class="card-row">
              <v-col md="3">
                Block Height:
              </v-col>
              <v-col md="9">
                <span v-if="pending">pending</span>
                <nuxt-link
                  v-else
                  :to="{ name: 'Block', params: { number: txn.blockNumber } }"
                  >{{ txn.blockNumber }}</nuxt-link
                >
                ({{ confirmations }} block confirmations)
              </v-col>
            </v-row>
            <v-row v-if="pending === false" class="card-row">
              <v-col md="3">
                TimeStamp:
              </v-col>
              <v-col md="9"> ~{{ timestamp }} </v-col>
            </v-row>
            <v-row class="card-row">
              <v-col md="3">
                From:
              </v-col>
              <v-col md="9">
                <nuxt-link
                  :to="{ name: 'Address', params: { hash: txn.from } }"
                  >{{ txn.from }}</nuxt-link
                >
                {{ getAddressTag(txn.from) }}
              </v-col>
            </v-row>
            <v-row class="card-row">
              <v-col md="3">
                To:
              </v-col>
              <v-col md="9">
                <span v-if="txn.to"
                  ><nuxt-link
                    :to="{ name: 'Address', params: { hash: txn.to } }"
                    >{{ txn.to }}</nuxt-link
                  >
                  {{ getAddressTag(txn.to) }}</span
                >
                <span v-else>null</span>
              </v-col>
            </v-row>
            <v-row v-if="txn.contractAddress" class="card-row">
              <v-col md="3">
                Contract Deployed:
              </v-col>
              <v-col md="9">
                <nuxt-link
                  :to="{
                    name: 'Address',
                    params: { hash: txn.contractAddress }
                  }"
                  >{{ txn.contractAddress }}</nuxt-link
                >
                {{ getAddressTag(txn.contractAddress) }}
              </v-col>
            </v-row>
            <v-row v-if="tokenTransfered" class="card-row">
              <v-col md="3">
                Token Transfered:
              </v-col>
              <v-col md="9">
                <span class="fa fa-arrow-right" /> From
                <nuxt-link
                  :to="{ name: 'Address', params: { hash: token.from } }"
                  >{{ shortenAddress(token.from) }}</nuxt-link
                >
                To
                <nuxt-link
                  :to="{ name: 'Address', params: { hash: token.to } }"
                  >{{ shortenAddress(token.to) }}</nuxt-link
                >
                for {{ token.value }}
                <nuxt-link
                  :to="{ name: 'Token', params: { hash: token.contract } }"
                  >{{ token.symbol }}</nuxt-link
                >
              </v-col>
            </v-row>
            <v-row class="card-row">
              <v-col md="3">
                Value:
              </v-col>
              <v-col md="9">
                {{ fromWei(txn.value) }} UBQ (${{
                  calcValue(fromWei(txn.value), 2)
                }})
              </v-col>
            </v-row>
            <v-row class="card-row">
              <v-col md="3">
                Gas Limit:
              </v-col>
              <v-col md="9">
                <span v-if="pending">{{
                  formatNumber(toDecimal(txn.gas))
                }}</span>
                <span v-else>{{ formatNumber(txn.gas) }}</span>
              </v-col>
            </v-row>
            <v-row v-if="pending === false" class="card-row">
              <v-col md="3">
                Gas Used By Txn:
              </v-col>
              <v-col md="9">
                {{ formatNumber(txn.gasUsed) }}
              </v-col>
            </v-row>
            <v-row class="card-row">
              <v-col md="3">
                Gas Price:
              </v-col>
              <v-col md="9"> {{ fromWeiToGwei(txn.gasPrice) }} gwei </v-col>
            </v-row>
            <v-row v-if="pending === false" class="card-row">
              <v-col md="3">
                Actual Tx Cost/Fee:
              </v-col>
              <v-col md="9">
                {{ calcTxFee(txn.gasUsed, txn.gasPrice) }} UBQ (${{
                  calcValue(calcTxFee(txn.gasUsed, txn.gasPrice), 4)
                }})
              </v-col>
            </v-row>
            <v-row class="card-row">
              <v-col md="3">
                Nonce & [Position]:
              </v-col>
              <v-col md="9">
                <span v-if="pending"
                  >{{ toDecimal(txn.nonce) }} | [{{
                    toDecimal(txn.transactionIndex)
                  }}]</span
                >
                <span v-else
                  >{{ txn.nonce }} | [{{ txn.transactionIndex }}]</span
                >
              </v-col>
            </v-row>
            <v-row class="card-row">
              <v-col md="3">
                Input Data:
              </v-col>
              <v-col md="9">
                <v-card class="card-input-data">
                  <span v-if="inputType === 'original'">{{ txn.input }}</span>
                  <!-- leave this gross indentation for correct formatting inside pre -->
                  <pre v-if="inputType === 'default'">
Function: {{ inputData.function }}

MethodID: {{ inputData.methodId }}
<span v-for="(item, index) in inputData.params" :key="index">[{{ index }}]:  {{ item }}
</span>
                  </pre>
                </v-card>
                <b-dropdown
                  size="sm"
                  variant="secondary"
                  text="View Input As"
                  class="input-dropdown"
                >
                  <b-dropdown-item
                    v-if="inputData.function"
                    v-on:click="inputType = 'default'"
                    >Default View</b-dropdown-item
                  >
                  <b-dropdown-item v-on:click="inputType = 'original'"
                    >Original</b-dropdown-item
                  >
                </b-dropdown>
              </v-col>
            </v-row>
          </v-card>
        </b-tab>
        <b-tab v-if="showLogs" :title="'Event Logs (' + txn.logs.length + ')'">
          <v-card no-body class="block-card tav-card">
            <!-- leave this gross indentation for correct formatting inside pre -->
            <pre>
<strong>Transaction Receipt Event Logs</strong>
<v-card v-for="(item, index) in eventLogs" :key="index" class="card-input-data">
[{{item.index}}]  Address    {{ item.address }}
     <span v-if="item.isKnown">Name       {{ item.name }}</span>

     Topics<span v-for="(topic, tindex) in item.topics" :key="tindex">
                [{{ tindex }}] {{ topic }}</span>

     Data<span v-for="(data, dindex) in item.data" :key="dindex">
                {{ data }}</span>
</v-card>
            </pre>
          </v-card>
        </b-tab>
      </b-tabs>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import addresses from '~/scripts/addresses'
import common from '~/scripts/common'
import contracts from '~/scripts/contracts'
import tokens from '~/scripts/tokens'

export default {
  name: 'Transaction',
  props: {
    hash: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      refreshing: false,
      txn: {},
      notfound: false,
      tokenTransfered: false,
      showLogs: false,
      inputType: 'original',
      inputData: {},
      eventLogs: [],
      timestamp: '',
      token: {},
      pending: false,
      errors: []
    }
  },
  computed: {
    confirmations() {
      return this.pending === true
        ? 0
        : this.$store.state.latestBlock.number - this.txn.blockNumber
    },
    latestBlock() {
      return this.$store.state.latestBlock.number
    },
    priceUSD() {
      return this.$store.state.price.usd
    }
  },
  watch: {
    $route: {
      handler(from, to) {
        this.fetch()
      },
      immediate: true
    },
    latestBlock() {
      if (this.pending === true) {
        this.fetch()
      } else {
        this.timestamp = this.calcTime(this.txn.timestamp)
      }
    }
  },
  methods: {
    fetch() {
      this.refreshing = true
      axios
        .get(this.$store.state.api + 'transaction/' + this.hash)
        .then((response) => {
          if (response.data.hash) {
            this.txn = response.data
            this.timestamp = this.calcTime(this.txn.timestamp)
            if (response.data.logs.length > 0) {
              this.showLogs = true
              this.eventLogs = contracts.processEventLogs(this.txn.logs)
            }
            this.pending = false
          } else {
            axios
              .post(this.$store.state.rpc, {
                jsonrpc: '2.0',
                method: 'eth_getTransactionByHash',
                params: [this.hash],
                id: 1
              })
              .then((response_) => {
                if (response_.data.result) {
                  this.txn = response_.data.result
                  this.pending = true
                } else {
                  this.notfound = true
                }
              })
              .catch((e) => {
                this.errors.push(e)
              })
          }
          if (this.txn.input !== '0x') {
            this.inputData = contracts.processTxnInput(this.txn.input)
            if (this.inputData.isKnown === true) {
              this.inputType = 'default'
            }
            this.token = tokens.processInputData(this.txn, this.inputData)
            if (this.token.isTokenTxn) {
              this.tokenTransfered = true
            }
          }
        })
        .catch((e) => {
          this.errors.push(e)
        })

      const self = this
      setTimeout(function() {
        self.refreshing = false
      }, 2000)
    },
    getAddressTag(hash) {
      const tag = addresses.getAddressTag(hash)
      if (tag) {
        return '(' + tag + ')'
      } else {
        return ''
      }
    },
    shortenAddress(hash) {
      return hash.substring(0, 17) + '...'
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
      return common.mulFiat(ubq, this.priceUSD, decimals)
    }
  }
}
</script>
