<template>
  <v-col cols="12" class="pa-0">
    <breadcrumbSpinner v-bind="$attrs" no-loading />
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
              Also known as Block Number. Block height, which indicates the
              length of the blockchain, increases after the addition of a new
              block.
            </span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Height</v-list-item-title>
          <v-list-item-subtitle>{{ uncle.number }}</v-list-item-subtitle>
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
            <span>The block that included this uncle.</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Included In</v-list-item-title>
          <v-list-item-subtitle>
            <nuxt-link
              :to="{ name: 'block-id', params: { id: uncle.blockNumber } }"
            >
              {{ uncle.blockNumber }}
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
            <span>The date and time in which the block was mined.</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Timestamp</v-list-item-title>
          <v-list-item-subtitle>
            ~{{ calcTime(uncle.timestamp) }}
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
            <span>The miner/pool which solved the uncle.</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Miner</v-list-item-title>
          <v-list-item-subtitle>
            <nuxt-link
              :to="{
                name: 'address-account',
                params: { account: uncle.miner },
              }"
            >
              {{ getAddressTag(uncle.miner) }}
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
              For each block, the miner is rewarded a finite amount of ubq on
              top of the fees paid for transactions in the block.
            </span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Block Reward</v-list-item-title>
          <v-list-item-subtitle>
            {{ fromWei(uncle.reward) }} UBQ
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
              The total gas used in the block and its percentage of gas filled
              in the block.
            </span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Gas Used</v-list-item-title>
          <v-list-item-subtitle>
            {{ formatNumber(uncle.gasUsed) }}
            ({{ calcGasUsed(uncle.gasUsed, uncle.gasLimit) }})
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
            {{ formatNumber(uncle.gasLimit) }}
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
              The amount of effort required to mine a new block. The difficulty
              algorithm may adjust according to time.
            </span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Difficulty</v-list-item-title>
          <v-list-item-subtitle>
            {{ formatNumber(uncle.difficulty) }}
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
            <span>The hash of the block header of the current block.</span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Hash</v-list-item-title>
          <v-list-item-subtitle>{{ uncle.hash }}</v-list-item-subtitle>
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
              The hash of the block from which this block was generated, also
              known as its parent block
            </span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Parent Hash</v-list-item-title>
          <v-list-item-subtitle>
            {{ uncle.parentHash }}
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
              The mechanism which the Javascript RLP encodes an empty string.
            </span>
          </v-tooltip>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Sha3Uncles</v-list-item-title>
          <v-list-item-subtitle>
            {{ uncle.sha3Uncles }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-col>
</template>

<script>
import axios from 'axios'
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  name: 'Uncle',
  components: {
    breadcrumbSpinner,
  },
  props: {
    hash: {
      type: String,
      default: () => {
        return ''
      },
    },
  },
  async fetch() {
    const {
      data: { result },
    } = await axios.post(process.env.config.apiUrl, {
      jsonrpc: '2.0',
      method: 'explorer_uncleByHash',
      params: [this.$route.params.hash],
      id: 88,
    })

    this.uncle = result
  },
  data() {
    return {
      uncle: {},
    }
  },
  methods: {
    calcTime(timestamp) {
      return common.calcTime(timestamp)
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash
    },
    fromWei(val, roundTo) {
      return common.fromWei(val, roundTo)
    },
    fromWeiToGwei(val) {
      return common.fromWeiToGwei(val)
    },
    formatNumber(val) {
      if (val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return '0'
      }
    },
    calcGasUsed(gasUsed, gasLimit) {
      return ((gasUsed / gasLimit) * 100).toFixed(2) + '%'
    },
    toUtf8(val) {
      return common.toUtf8(val)
    },
    toAscii(val) {
      return common.toAscii(val)
    },
  },
}
</script>
