<template>
  <table-view no-loading :headers="headers" :items="tokens" item-key="address">
    <template v-slot:item.address="{ value: address }">
      <nuxt-link
        :to="{ name: 'account-address', params: { address: address } }"
      >
        {{ address.substr(0, 23) }}...
      </nuxt-link>
    </template>
  </table-view>
</template>

<script>
import tableView from '~/components/util/TableView'
export default {
  components: {
    tableView
  },
  props: {
    tokens: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      headers: [
        {
          value: 'symbol',
          text: 'Symbol'
        },
        {
          value: 'name',
          text: 'Name'
        },
        {
          value: 'decimals',
          text: 'Decimals'
        },
        {
          value: 'address',
          text: 'Address'
        }
      ]
    }
  }
}
</script>
