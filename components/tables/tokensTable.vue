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
      ${{ (derivedUBQ * ubqPrice).toFixed(4) }}
    </template>
    <template v-slot:item.totalLiquidity="{ item }">
      ${{ (item.totalLiquidity * (item.derivedETH * ubqPrice)).toFixed(2) }}
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
          value: 'derivedETH',
          text: 'Value (USD)',
        },
        {
          value: 'totalLiquidity',
          text: 'Liquidity (USD)',
        },
      ],
    }
  },
  methods: {
    checksumHash(hash) {
      return toChecksumAddress(hash)
    },
  },
}
</script>
