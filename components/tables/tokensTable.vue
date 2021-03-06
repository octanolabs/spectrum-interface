<template>
  <table-view no-loading :headers="headers" :items="tokens" item-key="id">
    <template v-slot:item.name="{ item }">
      <v-avatar size="24">
        <v-img
          :src="
            'https://raw.githubusercontent.com/octanolabs/assets/master/blockchains/ubiq/assets/' +
            checksumHash(item.id) +
            '/logo.png'
          "
        />
      </v-avatar>
      <template v-if="item.symbol !== 'WUBQ'">
        <nuxt-link
          :to="{ name: 'account-address', params: { address: item.id } }"
        >
          {{ item.name }}
        </nuxt-link>
      </template>
      <template v-if="item.symbol === 'WUBQ'">Ubiq</template>
    </template>
    <template v-slot:item.symbol="{ item }">
      <template v-if="item.symbol !== 'WUBQ'">
        {{ item.symbol }}
      </template>
      <template v-if="item.symbol === 'WUBQ'">UBQ</template>
    </template>
    <template v-slot:item.derivedETH="{ value: derivedUBQ }">
      ${{ nf.format(derivedUBQ * ubqPrice) }}
    </template>
    <template v-slot:item.totalLiquidity="{ item }">
      ${{ nf.format(item.totalLiquidity * (item.derivedETH * ubqPrice)) }}
    </template>
  </table-view>
</template>

<script>
import { toChecksumAddress } from 'ethereumjs-util'
import tableView from '~/components/util/TableView'
export default {
  components: {
    tableView,
  },
  props: {
    tokens: {
      type: Array,
      required: true,
      default: () => [],
    },
    ubqPrice: {
      type: Number,
      required: true,
      default() {
        return 0
      },
    },
  },
  data() {
    return {
      nf: new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 18,
      }),
      headers: [
        {
          value: 'name',
          text: 'Name',
        },
        {
          value: 'symbol',
          text: 'Symbol',
        },
        {
          value: 'totalLiquidity',
          text: 'Liquidity (USD)',
        },
        {
          value: 'derivedETH',
          text: 'Value (USD)',
        },
      ],
    }
  },
  methods: {
    checksumHash(hash) {
      return toChecksumAddress(hash)
    },
    formatNumber(val) {
      if (val) {
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      } else {
        return ''
      }
    },
  },
}
</script>
