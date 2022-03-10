<template>
  <table-view
    no-loading
    :headers="headers"
    :items="accounts"
    item-key="address"
    disable-pagination
    :options="{ itemsPerPage: -1 }"
    :footer-props="{
      disableItemsPerPage: true,
    }"
  >
    <template v-slot:topMessage>
      Showing {{ nf0.format(accounts.length) }} accounts from a total of
      {{ nf0.format(total) }}
    </template>
    <template v-slot:item.rank="{ item }">
      <h3>{{ accounts.indexOf(item) + 1 }}</h3>
    </template>
    <template v-slot:item.address="{ item }">
      <account-list-item
        :address="item.address"
        :name="getAddressTitle(item.address)"
        link
        style="margin-left: -15px"
      />
    </template>
    <template v-slot:item.balance="{ item }">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            {{ nf.format(fromWei(item.balance)) }}
          </v-list-item-title>
          <v-list-item-subtitle>
            ${{ nf.format(fromWei(item.balance) * price) }}
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </template>
    <template v-slot:item.usd="{ item }">
      ${{ nf.format(item.balance * price) }}
    </template>
    <template v-slot:item.percent="{ item }">
      {{ ((item.balance / supply) * 100).toFixed(6) }}
    </template>
    <template v-slot:item.block="{ item }">
      <nuxt-link :to="{ name: 'block-id', params: { id: item.block } }">
        {{ nf0.format(item.block) }}
      </nuxt-link>
    </template>
  </table-view>
</template>

<script>
import { toChecksumAddress } from 'ethereumjs-util'
import AccountListItem from '../AccountListItem.vue'
import tableView from '~/components/util/TableView'
import common from '~/scripts/common'
import addresses from '~/scripts/addresses'

export default {
  components: {
    tableView,
    AccountListItem,
  },
  props: {
    accounts: {
      type: Array,
      required: true,
      default: () => [],
    },
    total: {
      type: Number,
      required: true,
      default: () => 0,
    },
    price: {
      type: String,
      required: true,
      default() {
        return '0'
      },
    },
    supply: {
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
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      nf0: new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
      headers: [
        {
          value: 'rank',
          text: '#',
          align: 'center',
          sortable: false,
        },
        {
          value: 'address',
          text: 'Address',
          align: 'left',
          sortable: false,
        },
        {
          value: 'balance',
          text: 'Balance (UBQ)',
          align: 'right',
          sortable: false,
        },
        {
          value: 'percent',
          text: 'Supply %',
          align: 'right',
          sortable: false,
        },
        {
          value: 'block',
          text: 'Last Seen (block)',
          align: 'right',
          sortable: false,
        },
      ],
    }
  },
  methods: {
    calculateUSD(hash) {
      return toChecksumAddress(hash)
    },
    toChecksumAddress(hash) {
      return common.toChecksumAddress(hash)
    },
    getAddressTitle(hash) {
      const tag = addresses.getAddressTag(hash.toLowerCase())
      if (tag) {
        return tag
      } else {
        return ''
      }
    },
    fromWei(wei) {
      return common.fromWei(wei)
    },
    handleClick(item) {
      console.log(item)
    },
  },
}
</script>
