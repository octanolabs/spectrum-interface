<template>
  <table-view
    :items="transfers"
    :headers="headers"
    item-key="hash"
    v-bind="$attrs"
    :loading="loading"
    @refresh="$emit('refresh')"
  >
    <template v-slot:topMessage>
      Latest {{ formatNumber(transfers.length) }} token transfers from a total
      of {{ formatNumber(total) }}
      <span id="icon"></span>
    </template>
    <template v-slot:item.hash="{ value: txHash }">
      <nuxt-link :to="{ name: 'transaction-hash', params: { hash: txHash } }">
        {{ formatHash(txHash) }}
      </nuxt-link>
    </template>
    <template v-slot:item.timestamp="{ value: timestamp }">
      ~{{ calcTime(timestamp) }}
    </template>
    <template v-slot:item.from="{ value: fromAddress }">
      <!--      TODO: address route-->
      <span
        v-if="fromAddress === '0x0000000000000000000000000000000000000000'"
        style="color: #00ea90"
      >
        <v-tooltip attach="#icon" nudge-right="150" nudge-bottom="60">
          <template v-slot:activator="{ on }">
            <v-icon color="primary" small v-on="on">
              mdi-information-outline
            </v-icon>
          </template>
          <div class="d-block text-wrap">
            Token transfers coming from
            0x0000000000000000000000000000000000000000 are actually newly minted
            tokens from the token contract.
          </div>
        </v-tooltip>
        <nuxt-link
          :to="{ to: 'account-address', params: { address: fromAddress } }"
        >
          {{ getAddressTag(fromAddress) }}
        </nuxt-link>
      </span>
      <nuxt-link
        v-else
        :to="{ name: 'account-address', params: { address: fromAddress } }"
      >
        {{ getAddressTag(fromAddress) }}
      </nuxt-link>
    </template>
    <template v-slot:item.to="{ value: toAddress }">
      <nuxt-link
        :to="{ name: 'account-address', params: { address: toAddress } }"
      >
        {{ getAddressTag(toAddress) }}
      </nuxt-link>
    </template>
    <template v-slot:item.value="{ item: { value, contract } }">
      {{ nf.format(formatValue(value, contract)) }}
    </template>

    <template v-slot:item.contract="{ value: contractAddress }">
      <v-avatar size="16">
        <v-img
          :src="
            'https://raw.githubusercontent.com/octanolabs/assets/master/blockchains/ubiq/assets/' +
            toChecksumAddress(contractAddress) +
            '/logo.png'
          "
        >
          <template v-slot:placeholder>
            <blockie :address="contractAddress" size="xs" inline />
          </template>
        </v-img>
      </v-avatar>
      <nuxt-link
        :to="{ name: 'account-address', params: { address: contractAddress } }"
      >
        {{ getName(contractAddress) }}
      </nuxt-link>
    </template>
    <template v-slot:item.status="{ value: status }">
      <v-icon v-if="status" color="success">mdi-check-circle</v-icon>
      <v-icon v-else color="error">mdi-alert-circle</v-icon>
    </template>
  </table-view>
</template>

<script>
import BigNumber from 'bignumber.js'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'
import TableView from '~/components/util/TableView'
import Blockie from '~/components/util/misc/Blockie'

export default {
  components: {
    TableView,
    Blockie,
  },
  props: {
    transfers: {
      type: Array,
      required: true,
      default: () => [],
    },
    total: {
      type: Number,
      required: true,
      default: 0,
    },
    loading: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data: () => {
    return {
      currentPage: 1,
      perPage: 25,
      totalRows: 0,
      nf: new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 18,
      }),
      headers: [
        {
          value: 'hash',
          text: 'TxHash',
          sortable: false,
        },
        {
          value: 'timestamp',
          text: 'Age',
          sortable: false,
        },
        {
          value: 'from',
          text: 'From',
          sortable: false,
        },
        {
          value: 'to',
          text: 'To',
          sortable: false,
        },
        {
          value: 'value',
          text: 'Value',
          sortable: false,
        },
        {
          value: 'contract',
          text: 'Token',
          sortable: false,
        },
        {
          text: '',
          value: 'status',
          sortable: false,
        },
      ],
    }
  },
  computed: {
    tokens() {
      return this.$store.state.tokens.erc20
    },
  },
  methods: {
    getRowCount(items) {
      return items.length
    },
    getAddressTag(hash) {
      const checksum = common.toChecksumAddress(hash)
      return (
        addresses.getAddressTag(hash) ||
        checksum.substr(0, 8) + '...' + checksum.substr(hash.length - 6)
      )
    },
    calcTime(timestamp) {
      return this.$moment().to(timestamp * 1000)
    },
    formatValue(val, contract) {
      if (this.tokens[contract]) {
        const decimals = new BigNumber(10).pow(this.tokens[contract].decimals)
        return new BigNumber(val).div(decimals).toString()
      }
      return val
    },
    getName(contract) {
      if (this.tokens[contract]) {
        return (
          this.tokens[contract].symbol + ' (' + this.tokens[contract].name + ')'
        )
      }
      return common.toChecksumAddress(contract)
    },
    formatNumber(val) {
      return common.formatNumber(val)
    },
    toChecksumAddress(address) {
      return common.toChecksumAddress(address)
    },
    formatHash(hash) {
      return hash.substr(0, 10) + '...' + hash.substr(hash.length - 8)
    },
  },
}
</script>
