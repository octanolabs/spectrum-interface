<template>
  <v-row class="justify-content-md-center">
    <v-col md="10">
      <v-breadcrumbs>
        <v-breadcrumbs-item :to="{ name: 'Home' }">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item active>Uncles</v-breadcrumbs-item>
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
      <UnclesTable :items="uncles" :total="total" />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import UnclesTable from '~/components/tables/Uncles.vue'

export default {
  name: 'Blocks',
  components: {
    UnclesTable
  },
  data() {
    return {
      refreshing: false,
      uncles: [],
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
        .get(this.$store.state.api + 'latestuncles/1000')
        .then((response) => {
          this.uncles = response.data.uncles
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
