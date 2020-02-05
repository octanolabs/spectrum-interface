<template>
  <v-row class="justify-content-md-center">
    <v-col md="10">
      <v-breadcrumbs>
        <v-breadcrumbs-item :to="{ name: 'Home' }">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item active>Blocks</v-breadcrumbs-item>
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
      <BlocksTable :items="blocks" :total="total" />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import BlocksTable from '~/components/tables/Blocks.vue'

export default {
  name: 'Blocks',
  components: {
    BlocksTable
  },
  data() {
    return {
      refreshing: false,
      blocks: [],
      total: 0
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
        .get(this.$store.state.api + 'latestblocks/1000')
        .then((response) => {
          this.blocks = response.data.blocks
          this.total = response.data.total
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
