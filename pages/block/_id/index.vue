<template>
  <v-col cols="12" class="pa-0">
    <breadcrumbSpinner v-bind="$attrs" no-loading />
    <v-tabs v-model="tab" grow show-arrows>
      <v-tab href="#overview">Overview</v-tab>
      <v-tab href="#transactions">
        Transactions
        <v-chip label small class="ml-1">
          {{ txnCount }}
        </v-chip>
      </v-tab>
      <v-tab href="#itransactions">
        Internal Txns
        <v-chip label small class="ml-1">
          {{ itxnCount }}
        </v-chip>
      </v-tab>
      <v-tab-item eager value="overview">
        <!-- If the selected tab has at least one slot, use normal layout-->
        <v-col cols="12" class="pa-1">
          <v-list dense>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    Also known as Block Number. Block height, which indicates
                    the length of the blockchain, increases after the addition
                    of a new block.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Height</v-list-item-title>
                <v-list-item-subtitle>{{ block.number }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <nuxt-link
                  :to="{
                    name: 'block-id',
                    params: { id: block.number - 1 },
                  }"
                >
                  <v-icon>mdi-arrow-left-drop-circle-outline</v-icon>
                </nuxt-link>
              </v-list-item-action>
              <v-list-item-action>
                <nuxt-link
                  :to="{ name: 'block-id', params: { id: block.number + 1 } }"
                >
                  <v-icon>mdi-arrow-right-drop-circle-outline</v-icon>
                </nuxt-link>
              </v-list-item-action>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>The date and time in which the block was mined.</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Timestamp</v-list-item-title>
                <v-list-item-subtitle>
                  ~{{ calcTime(block.timestamp) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>The miner/pool which solved the block.</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Miner</v-list-item-title>
                <v-list-item-subtitle>
                  <nuxt-link
                    :to="{
                      name: 'address-account',
                      params: { account: block.miner },
                    }"
                  >
                    {{ getAddressTag(block.miner) }}
                  </nuxt-link>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    For each block, the miner is rewarded a finite amount of ubq
                    on top of the fees paid for transactions in the block.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Block Reward</v-list-item-title>
                <v-list-item-subtitle>
                  {{ fromWei(block.blockReward) }} UBQ
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    An uncle block has a significantly lower reward than a
                    normal block. Uncles reward is valid but rejected as it is
                    not on the longest chain which is the working mechanism of
                    the blockchain.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Uncles Reward</v-list-item-title>
                <v-list-item-subtitle>
                  {{ fromWei(block.uncleRewards) }} UBQ
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>Transactions fees included in this block.</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Transaction Fees</v-list-item-title>
                <v-list-item-subtitle>
                  {{ fromWei(block.txFees) }} UBQ
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>Average price paid per unit of gas.</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Average Gas Price</v-list-item-title>
                <v-list-item-subtitle>
                  {{ fromWeiToGwei(block.avgGasPrice) }} Gwei
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    The total gas used in the block and its percentage of gas
                    filled in the block.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Gas Used</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatNumber(block.gasUsed) }}
                  ({{ calcGasUsed(block.gasUsed, block.gasLimit) }})
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>Base fee per gas (EIP-1559)</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Base Fee</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatNumber(block.baseFeePerGas) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    Total gas limit provided by all transactions in the block.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Gas Limit</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatNumber(block.gasLimit) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    The amount of effort required to mine a new block. The
                    difficulty algorithm may adjust according to time.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Difficulty</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatNumber(block.difficulty) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>Total difficulty of the chain until this block.</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Total Difficulty</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatNumber(block.totalDifficulty) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    The block size is actually determined by the block's gas
                    limit.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Size</v-list-item-title>
                <v-list-item-subtitle>
                  {{ formatNumber(block.size) }} bytes
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <!-- hidden -->
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    Any data that can be included by the miner in the block.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Extra Data</v-list-item-title>
                <v-list-item-subtitle>
                  {{ toUtf8(block.extraData) || toAscii(block.extraData) }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ block.extraData }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    The hash of the block header of the current block.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Hash</v-list-item-title>
                <v-list-item-subtitle>{{ block.hash }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    The hash of the block from which this block was generated,
                    also known as its parent block.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Parent Hash</v-list-item-title>
                <v-list-item-subtitle>
                  {{ block.parentHash }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    The mechanism which the Javascript RLP encodes an empty
                    string.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Sha3Uncles</v-list-item-title>
                <v-list-item-subtitle>
                  {{ block.sha3Uncles }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    Block nonce is a value used during mining to demonstrate
                    proof of work for a block.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Nonce</v-list-item-title>
                <v-list-item-subtitle>
                  {{ block.nonce }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>Amount of UBQ minted in this block.</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Minted</v-list-item-title>
                <v-list-item-subtitle>
                  {{ fromWei(block.minted) }} UBQ
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>Amount of UBQ burned in this block (EIP-1559)</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Burned</v-list-item-title>
                <v-list-item-subtitle>
                  {{ fromWei(block.burned) }} UBQ
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>
                    Total burned via EIP-1559 up to and including this block.
                  </span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Total Burned (EIP-1559)</v-list-item-title>
                <v-list-item-subtitle>
                  {{ fromWei(block.totalBurned) }} UBQ
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="border-bottom: 1px solid #272727">
              <v-list-item-action>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon v-bind="attrs" v-on="on">
                      mdi-information-outline
                    </v-icon>
                  </template>
                  <span>Total supply of UBQ at this block height.</span>
                </v-tooltip>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Total Supply</v-list-item-title>
                <v-list-item-subtitle>
                  {{ fromWei(block.supply) }} UBQ
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-tab-item>
      <v-tab-item value="transactions">
        <txns-table
          :transactions="transactions"
          :total="transactions.length"
          :block-number="block.number"
          no-breadcrumbs
          block
        />
      </v-tab-item>
      <v-tab-item value="itransactions">
        <itxns-table
          :transactions="iTransactions"
          :total="iTransactions.length"
          :block-number="block.number"
          no-breadcrumbs
          block
        />
      </v-tab-item>
    </v-tabs>
  </v-col>
</template>

<script>
import axios from 'axios'
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import txnsTable from '~/components/tables/txnsTable.vue'
import itxnsTable from '~/components/tables/itxnsTable.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  name: 'Block',
  components: {
    breadcrumbSpinner,
    txnsTable,
    itxnsTable,
  },
  validate({ params }) {
    if (/^\d+$/.test(params.id)) {
      return true
    }
    return /^0x([A-Fa-f0-9]{64})$/.test(params.id)
  },
  async fetch() {
    let id = this.$route.params.id
    let method = ''

    if (/^\d+$/.test(id)) {
      method = `explorer_blockByNumber`
      id = parseInt(id, 10)
    } else {
      method = `explorer_blockByHash`
    }

    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method,
      params: [id],
      id: 88,
    })
    console.log(result)
    this.block = result
    this.transactions = result.transactions
    this.iTransactions = []
    if (result.iTransactions) {
      this.iTransactions = result.iTransactions
    }
  },
  data() {
    return {
      block: {},
      transactions: [],
      iTransactions: [],
    }
  },
  computed: {
    openTransactions() {
      return this.$route.params.action === 'transactions'
    },
    tab: {
      set(tab) {
        this.$router.replace({ query: { ...this.$route.query, tab } })
      },
      get() {
        return this.$route.query.tab
      },
    },
    txnCount() {
      return this.transactions?.length || 0
    },
    itxnCount() {
      return this.iTransactions?.length || 0
    },
  },
  middleware({ store }) {
    store.dispatch('fetchStats')
  },
  methods: {
    calcGasUsed(gasUsed, gasLimit) {
      return ((gasUsed / gasLimit) * 100).toFixed(2) + '%'
    },
    calcTime(timestamp) {
      return common.calcTime(timestamp)
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash
    },
    toTH(diff) {
      return common.toTH(diff, 4)
    },
    fromWei(val, roundTo) {
      return common.fromWei(val, roundTo)
    },
    formatNumber(val) {
      if (val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return '0'
      }
    },
    fromWeiToGwei(val) {
      return common.fromWeiToGwei(val)
    },
    toAscii(val) {
      return common.toAscii(val)
    },
    toUtf8(val) {
      return common.toUtf8(val)
    },
  },
}
</script>
