<template>
  <table-view
    no-loading
    :headers="headers"
    :items="tokens"
    item-key="id"
    :options="{
      itemsPerPage: 100,
    }"
    no-bar
  >
    <template v-slot:item.name="{ item }">
      <v-avatar size="24">
        <v-img
          :src="
            'https://raw.githubusercontent.com/octanolabs/assets/master/blockchains/ubiq/assets/' +
            checksumHash(item.id) +
            '/logo.png'
          "
        >
          <template v-slot:placeholder>
            <blockie :address="item.id" size="sm" inline />
          </template>
        </v-img>
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
import Blockie from '~/components/util/misc/Blockie'
export default {
  components: {
    tableView,
    Blockie,
  },
  props: {
    tokens: {
      type: Array,
      required: true,
      default: () => [],
    },
    ubqPrice: {
      type: String,
      required: true,
      default() {
        return '0'
      },
    },
  },
  data() {
    return {
      nf: new Intl.NumberFormat('en', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
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
          align: 'right',
        },
        {
          value: 'derivedETH',
          text: 'Value (USD)',
          align: 'right',
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
