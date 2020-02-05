<template>
  <v-row class="justify-content-md-center">
    <v-col md="10">
      <v-breadcrumbs>
        <v-breadcrumbs-item :to="{ name: 'Home' }">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item active>Forked Blocks (Reorgs)</v-breadcrumbs-item>
        <v-breadcrumbs-link>
          <b-button
            :class="{
              fa: true,
              'fa-refresh': true,
              'fa-spin': refreshing,
              'btn-breadcrumb': true
            }"
            v-on:click="fetch()"
          ></b-button>
        </v-breadcrumbs-link>
      </v-breadcrumbs>
      <ForkedBlocksTable :items="blocks" />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import ForkedBlocksTable from '~/components/tables/ForkedBlocks.vue'

export default {
  name: 'ForkedBlocks',
  components: {
    ForkedBlocksTable
  },
  data() {
    return {
      refreshing: false,
      blocks: []
    }
  },
  watch: {
    $route: {
      handler(from, to) {
        this.fetch()
      },
      immediate: true
    }
  },
  methods: {
    fetch() {
      this.refreshing = true
      axios
        .get(this.$store.state.api + 'latestforkedblocks/1000')
        .then((response) => {
          this.blocks = response.data
          const self = this
          setTimeout(function() {
            self.refreshing = false
          }, 2000)
        })
        .catch((e) => {
          this.errors.push(e)
        })
    }
  }
}
</script>
