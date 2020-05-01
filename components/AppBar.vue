<template>
  <!--  TODO:
  do smth like this

  -row
    -col, cols=12
    -col, expandable, place always under the other col
  -->

  <v-app-bar
    color="black"
    dark
    app
    :flat="!expandToolbar"
    :elevation="expandToolbar ? 16 : 0"
  >
    <v-app-bar-nav-icon>
      <nuxt-link to="/">
        <img src="../assets/logo.svg" width="26" height="26" />
      </nuxt-link>
    </v-app-bar-nav-icon>

    <v-toolbar-title>
      <nuxt-link to="/" style="color: #fff; text-decoration: none">
        Ubiqscan
      </nuxt-link>
    </v-toolbar-title>

    <v-spacer />
    <v-spacer />
    <v-spacer />

    <v-input hide-details>
      <v-text-field
        v-model="search"
        hide-details
        dense
        right
        type="text"
        label="Search by Address / Txhash / Block"
        style="max-width: 400px"
        @keydown="handleEvent"
      >
      </v-text-field>
      <template v-slot:append style="margin-bottom: 0; margin-top: 0;">
        <v-btn small block type="submit" @click="handleEvent">
          <v-icon dark>mdi-magnify</v-icon> Search
        </v-btn>
      </template>
    </v-input>

    <v-spacer />
    <v-spacer />

    <v-item-group class="d-flex justify-end align-center">
      <v-btn text @click="toggleToolbar('ANALYTICS')">ANALYTICS</v-btn>
      <v-btn text @click="toggleToolbar('BLOCKCHAIN')">BLOCKCHAIN</v-btn>
      <v-btn text @click="toggleToolbar('TOKENS')">TOKENS</v-btn>
      <v-btn text @click="toggleToolbar('MISC')">MISC</v-btn>
      <v-btn fab :disabled="!expandToolbar" text @click="toggleToolbar('')">
        <v-icon v-if="!expandToolbar">mdi-chevron-up</v-icon>
        <v-icon v-else color="primary">mdi-chevron-down</v-icon>
      </v-btn>
    </v-item-group>

    <template v-if="expandToolbar" v-slot:extension>
      <v-row align-content="center">
        <v-col
          v-for="(item, idx) in toolbarItems"
          :key="idx"
          class="text-center"
        >
          <a v-if="item.text === 'Network Stats'" :href="item.path">{{
            item.text
          }}</a>
          <nuxt-link v-else :to="item.path">
            {{ item.text }}
          </nuxt-link>
        </v-col>
      </v-row>
    </template>
  </v-app-bar>
</template>

<script>
import axios from 'axios'
import smoothReflow from 'vue-smooth-reflow'
import common from '../scripts/common'

// import navbarModal from './misc/navbarmodal'

export default {
  name: 'Navbar',
  // components: {
  //   navbarmodal: navbarModal
  // },
  mixins: [smoothReflow],
  data() {
    return {
      search: '',
      errors: [],
      activeToolbarItem: '',
      expandToolbar: false
    }
  },
  computed: {
    toolbarItems() {
      switch (this.activeToolbarItem) {
        case 'ANALYTICS':
          return [
            { path: '/charts', text: 'Charts' },
            { path: '/map', text: 'Node map' }
          ]
        case 'BLOCKCHAIN':
          return [
            { path: '/transactions/latest', text: 'View Txns' },
            { path: '/transactions/pending', text: 'View Pending Txns' },
            { path: '/blocks', text: 'View Blocks' },
            { path: '/uncles', text: 'View Uncles' },
            { path: '/forkedBlocks', text: 'Forked Blocks (Reorgs)' }
          ]
        case 'TOKENS':
          return [
            { path: '/tokens', text: 'View Tokens' },
            { path: '/tokentransfers', text: 'View Token Transfers' }
          ]
        case 'MISC':
          return [{ path: 'https://ubiq.darcr.us', text: 'Network Stats' }]
      }
      return ['']
    }
  },
  mounted() {
    this.$smoothReflow()
  },
  methods: {
    getRoutes(path = '') {
      this.$router.options.routes.forEach((route) => {
        this.items.push({
          name: route.name,
          path: route.path
        })
      })
    },
    handleEvent(e) {
      if (e instanceof KeyboardEvent) {
        if (e.code === 'Enter' || e.key === 'Enter') {
          this.submitSearch(this.search)
        }
      } else if (e instanceof MouseEvent) {
        this.submitSearch(this.search)
      }
    },
    toggleToolbar(item = '') {
      if (item !== '') {
        if (item !== this.activeToolbarItem) {
          // Expand toolbar
          this.expandToolbar = true
          this.activeToolbarItem = item
        } else {
          // If the same item is clicked again, collapse toolbar
          this.expandToolbar = false
          this.activeToolbarItem = ''
        }
      } else {
        // If item is empty string, collapse toolbar
        this.activeToolbarItem = ''
        this.expandToolbar = false
      }
    },
    submitSearch(str) {
      // remove whitespace
      str = str.replace(/\s/g, '')

      const address = new RegExp(/^0x[0-9a-fA-F]{40}$/i)
      const hash = new RegExp(/^0x[0-9a-fA-F]{64}$/i)

      if (address.test(str)) {
        // matches address format

        this.$router.push({
          name: 'account-address',
          params: { address: str.toLowerCase() }
        })
        this.search = ''
      } else if (hash.test(str)) {
        // is block or txn hash
        // check if block hash

        axios
          .post(process.env.config.rpcUrl, {
            jsonrpc: '2.0',
            method: 'eth_getBlockByHash',
            params: [str, false],
            id: 1
          })
          .then((response) => {
            if (response.data.result) {
              // is block hash
              this.$router.push({
                name: 'block-id',
                params: {
                  id: common.hexToDecimal(response.data.result.number)
                }
              })
              this.search = ''
            } else {
              // check if txn hash
              axios
                .post(process.env.config.rpcUrl, {
                  jsonrpc: '2.0',
                  method: 'eth_getTransactionByHash',
                  params: [str],
                  id: 2
                })
                .then((response) => {
                  if (response.data.result) {
                    // is txn hash
                    this.$router.push({
                      name: 'transaction-hash',
                      params: { hash: str.toLowerCase() }
                    })
                    this.search = ''
                  } else {
                    // hash is not valid txn or block hash

                    this.$notify({
                      group: 'normal',
                      text:
                        '<span class="fa fa-search"/> Invalid Txn/Block Hash: ' +
                        str,
                      type: 'error'
                    })
                  }
                })
                .catch((e) => {
                  this.errors.push(e)
                })
            }
          })
          .catch((e) => {
            this.errors.push(e)
          })
      } else if (!isNaN(parseFloat(str)) && isFinite(str)) {
        // is potential block number
        this.$router.push({ name: 'block-id', params: { id: str } })
        this.search = ''
      } else {
        this.$notify({
          group: 'normal',
          text: '<span class="fa fa-search"/> Invalid search params: ' + str,
          type: 'error'
        })
      }
    }
  }
}
</script>
<style scoped>
.v-input__append-outer {
  margin-top: 0px !important;
  margin-bottom: 0px !important;
}
</style>
