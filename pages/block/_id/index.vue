<template>
  <v-col cols="12" class="pa-0">
    <breadcrumbSpinner v-bind="$attrs" no-loading />
    <v-tabs grow show-arrows v-model="tab">
      <v-tab>Overview</v-tab>
      <v-tab>
        Transactions
        <v-chip label small class="ml-1">{{ block.transactions }}</v-chip>
      </v-tab>
      <v-tab-item eager>
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
                      name: 'account-address',
                      params: { address: block.miner },
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
                  <span>boom</span>
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
      <v-tab-item>
        <txns-table
          :transactions="transactions"
          :total="transactions.length"
          :block-number="block.number"
          no-breadcrumbs
          block
        />
      </v-tab-item>
    </v-tabs>
  </v-col>
</template>

<router>
  path: /block/:id/:action?
</router>

<script>
import axios from 'axios'
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import txnsTable from '~/components/tables/txnsTable.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  name: 'Block',
  components: {
    breadcrumbSpinner,
    txnsTable,
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
    } = await axios
      .post(process.env.config.apiUrl, {
        jsonrpc: '2.0',
        method,
        params: [id],
        id: 88,
      })
      .then(({ data: { result: block } }) => {
        this.block = block

        return axios.post(process.env.config.apiUrl, {
          jsonrpc: '2.0',
          method: 'explorer_transactionsByBlockNumber',
          params: [block.number],
          id: 88,
        })
      })

    this.transactions = result
  },
  data() {
    return {
      block: {},
      transactions: [],
      tab: null,
    }
  },
  computed: {
    openTransactions() {
      return this.$route.params.action === 'transactions'
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
