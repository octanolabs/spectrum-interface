<template>
  <v-col cols="12" class="pa-0">
    <blocksTable
      :blocks="blocksStore.blocks"
      :total="blocksStore.total"
      :loading="$fetchState.pending"
      @refresh="$fetch"
    />
  </v-col>
</template>

<script>
import blocksTable from '~/components/tables/blocksTable.vue'

export default {
  name: 'Blocks',
  components: {
    blocksTable,
  },
  async fetch() {
    await this.$store.dispatch('blocks/fetchBlocks')
  },
  computed: {
    blocksStore() {
      return this.$store.state.blocks
    },
  },
  created() {
    setTimeout(() => {
      this.$fetch()
    }, 60000)
  },
}
</script>
