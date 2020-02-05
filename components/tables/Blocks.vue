<template>
  <v-row>
    <v-col md="12">
      <nav style="margin-right:-4px;">
        <v-pagination
          :total-rows="getRowCount(items)"
          :per-page="perPage"
          v-model="currentPage"
          size="md"
          align="right"
          prev-text="Prev"
          next-text="Next"
        />
      </nav>
      <b-card no-body>
        <span style="margin:15px 15px 5px 15px;"
          >Latest {{ formatNumber(items.length) }} blocks from a total of
          {{ formatNumber(total) }}</span
        >
        <hr />
        <v-data-table
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          class="mb-0"
          responsive="sm"
          hover
          stacked="sm"
        >
          <div slot="number" slot-scope="data">
            <nuxt-link
              :to="{ name: 'Block', params: { number: data.value } }"
              >{{ data.value }}</nuxt-link
            >
          </div>
          <div slot="transactions" slot-scope="data">
            <template v-if="data.value !== 0">
              <nuxt-link
                :to="{
                  name: 'Transactions',
                  params: { type: 'block', blockNumber: data.item.number }
                }"
                >{{ data.value }}</nuxt-link
              >
            </template>
            <template v-else>
              <span>{{ data.value }}</span>
            </template>
          </div>
          <div slot="miner" slot-scope="data">
            <nuxt-link
              :to="{ name: 'Address', params: { hash: data.value } }"
              >{{ getAddressTag(data.value) }}</nuxt-link
            >
          </div>
          <div slot="gasUsed" slot-scope="data">
            {{ data.value }} ({{ calcGasUsed(data.value, data.item.gasLimit) }})
          </div>
          <div slot="avgGasPrice" slot-scope="data">
            <span v-if="data.value !== 'NaN'"
              >{{ fromWeiToGwei(data.value) }} gwei</span
            >
            <span v-else>-</span>
          </div>
          <div slot="blockReward" slot-scope="data">
            {{ fromWei(addTxFees(data.value, data.item.txFees)) }} UBQ
          </div>
        </v-data-table>
      </b-card>
      <nav style="margin-right:-4px;margin-top:15px;">
        <v-pagination
          :total-rows="getRowCount(items)"
          :per-page="perPage"
          v-model="currentPage"
          size="md"
          align="right"
          prev-text="Prev"
          next-text="Next"
        />
      </nav>
    </v-col>
  </v-row>
</template>

<script>
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'
export default {
  props: {
    items: {
      type: Array
    },
    total: {
      type: Number
    }
  },
  data: () => {
    return {
      currentPage: 1,
      perPage: 25,
      totalRows: 0,
      fields: {
        number: {
          label: 'Height'
        },
        transactions: {
          label: 'Txns'
        },
        uncles: {
          label: 'Uncles'
        },
        miner: {
          label: 'Miner'
        },
        gasUsed: {
          label: 'GasUsed'
        },
        gasLimit: {
          label: 'GasLimit'
        },
        avgGasPrice: {
          label: 'Avg.GasPrice'
        },
        blockReward: {
          label: 'Reward'
        }
      }
    }
  },
  methods: {
    getRowCount(items) {
      return items.length
    },
    fromWei(value) {
      return common.fromWei(value)
    },
    fromWeiToGwei(value) {
      return common.fromWeiToGwei(value)
    },
    addTxFees(reward, txFees) {
      return common.addTxFees(reward, txFees)
    },
    getAddressTag(hash) {
      return addresses.getAddressTag(hash) || hash.substring(0, 17) + '...'
    },
    calcGasUsed(gasUsed, gasLimit) {
      return ((gasUsed / gasLimit) * 100).toFixed(2) + '%'
    },
    formatNumber(val) {
      return common.formatNumber(val)
    }
  }
}
</script>
