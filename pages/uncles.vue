<template>
  <v-col cols="12" class="pa-0">
    <uncles-table
      :uncles="unclesStore.uncles"
      :total="unclesStore.total"
      :loading="$fetchState.pending"
      @refresh="$fetch"
    />
  </v-col>
</template>

<script>
import unclesTable from '~/components/tables/unclesTable.vue'

export default {
  name: 'Uncles',
  components: {
    unclesTable,
  },
  async fetch() {
    await this.$store.dispatch('uncles/fetchUncles')
  },
  computed: {
    unclesStore() {
      return this.$store.state.uncles
    },
  },
  created() {
    setTimeout(() => {
      this.$fetch()
    }, 60000)
  },
}
</script>
