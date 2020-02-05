<template>
  <v-app-bar color="black" dark app>
    <v-row align="center" justify="end">
      <v-col cols="4" class="d-flex align-center">
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
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3">
        <v-text-field
          dense
          right
          hide-details
          type="text"
          label="Search by Address / Txhash / Block"
          style="max-width: 400px"
        >
          <template
            v-slot:append-outer
            style="margin-bottom: 0; margin-top: 0;"
          >
            <v-btn small block type="submit">
              <v-icon dark>mdi-magnify</v-icon> Search
            </v-btn>
          </template>
        </v-text-field>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="4" align-self="end">
        <v-item-group class="d-flex justify-end align-center">
          <v-btn @click="toggleToolbar('NODE MAP')" text>NODE MAP</v-btn>
          <v-btn @click="toggleToolbar('CHARTS')" text>CHARTS</v-btn>
          <v-btn @click="toggleToolbar('BLOCKCHAIN')" text>BLOCKCHAIN</v-btn>
          <v-btn @click="toggleToolbar('TOKENS')" text>TOKENS</v-btn>
          <v-btn @click="toggleToolbar('MISC')" text>MISC</v-btn>
          <v-btn v-if="!expandToolbar" fab text>
            <v-icon key="1">mdi-chevron-up</v-icon>
          </v-btn>
          <v-btn v-else @click="toggleToolbar('')" fab text>
            <v-icon key="2" color="primary">mdi-chevron-down</v-icon>
          </v-btn>
        </v-item-group>
      </v-col>
    </v-row>

    <template v-slot:extension v-if="expandToolbar">
      <v-toolbar flat color="transparent">
        <v-toolbar-items style="width:100%">
          <v-row align-content="center">
            <v-col
              v-for="(item, idx) in toolbarItems"
              :key="idx"
              class="text-center"
            >
              {{ item }}
            </v-col>
          </v-row>
        </v-toolbar-items>
      </v-toolbar>
    </template>
  </v-app-bar>

  <!--  <b-navbar toggleable="md" type="dark" variant="dark" fixed="top">-->
  <!--    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>-->

  <!--    <b-navbar-brand href="#"-->
  <!--      ></b-navbar-brand>-->

  <!--    <b-collapse id="nav_collapse" is-nav>-->
  <!--      <b-navbar-nav class="d-none d-md-block">-->
  <!--        <b-nav-form @submit.prevent="submitSearch(search)" autocomplete="off">-->
  <!--          <b-form-input-->
  <!--            v-model="search"-->
  <!--            size="sm"-->
  <!--            class="mr-sm-2 search-input"-->
  <!--            type="text"-->
  <!--            placeholder="Search by Address / Txhash / Block"-->
  <!--          />-->
  <!--          <b-button size="sm" class="my-2 my-sm-0" type="submit"-->
  <!--            >Search</b-button-->
  <!--          >-->
  <!--        </b-nav-form>-->
  <!--      </b-navbar-nav>-->

  <!--      &lt;!&ndash; Right aligned nav items &ndash;&gt;-->
  <!--      <b-navbar-nav class="ml-auto">-->
  <!--        <b-nav-item v-b-modal.modalPopover>BROADCAST TRANSACTION</b-nav-item>-->

  <!--        <navbarmodal id="modalPopover" />-->

  <!--        <b-nav-item :to="{ name: 'Home', params: {} }">HOME</b-nav-item>-->

  <!--        <b-nav-item :to="{ name: 'Map', params: {} }">NODE MAP</b-nav-item>-->

  <!--        <b-nav-item :to="{ name: 'Stats', params: {} }">STATS</b-nav-item>-->

  <!--        <b-nav-item-dropdown text="BLOCKCHAIN" right>-->
  <!--          <b-dropdown-item-->
  <!--            :to="{ name: 'Transactions', params: { type: 'latest' } }"-->
  <!--            ><span class="fa fa-list-alt" /> View Txns</b-dropdown-item-->
  <!--          >-->
  <!--          <b-dropdown-item-->
  <!--            :to="{ name: 'Transactions', params: { type: 'pending' } }"-->
  <!--            ><span class="fa fa-tasks" /> View Pending Txns</b-dropdown-item-->
  <!--          >-->
  <!--          <b-dropdown-divider />-->
  <!--          <b-dropdown-item :to="{ name: 'Blocks', params: {} }"-->
  <!--            ><span class="fa fa-cubes" /> View Blocks</b-dropdown-item-->
  <!--          >-->
  <!--          <b-dropdown-item :to="{ name: 'Uncles', params: {} }"-->
  <!--            ><span class="fa fa-cube" /> View Uncles</b-dropdown-item-->
  <!--          >-->
  <!--          <b-dropdown-divider />-->
  <!--          <b-dropdown-item :to="{ name: 'ForkedBlocks', params: {} }"-->
  <!--            ><span class="fa fa-code-fork" /> Forked Blocks-->
  <!--            (Reorgs)</b-dropdown-item-->
  <!--          >-->
  <!--        </b-nav-item-dropdown>-->

  <!--        <b-nav-item-dropdown text="TOKENS" right>-->
  <!--          <b-dropdown-item :to="{ name: 'Tokens', params: {} }"-->
  <!--            ><span class="fa fa-certificate" /> View Tokens</b-dropdown-item-->
  <!--          >-->
  <!--          <b-dropdown-item :to="{ name: 'TokenTransfers', params: {} }"-->
  <!--            ><span class="fa fa-navicon" /> View Token-->
  <!--            Transfers</b-dropdown-item-->
  <!--          >-->
  <!--        </b-nav-item-dropdown>-->

  <!--        <b-nav-item-dropdown text="MISC" right>-->
  <!--          <b-dropdown-item href="https://ubiq.darcr.us" target="_blank"-->
  <!--            ><span class="fa fa-dashboard" /> Network Stats</b-dropdown-item-->
  <!--          >-->
  <!--        </b-nav-item-dropdown>-->
  <!--      </b-navbar-nav>-->
  <!--    </b-collapse>-->
  <!--  </b-navbar>-->
</template>

<script>
import axios from 'axios'
import common from '../scripts/common'
import Tokens from '../scripts/tokens'
// import navbarModal from './misc/navbarmodal'
export default {
  name: 'Navbar',
  // components: {
  //   navbarmodal: navbarModal
  // },
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
        case 'NODE MAP':
          return ['Node map']
        case 'CHARTS':
          return ['Charts']
        case 'BLOCKCHAIN':
          return [
            'View Txns',
            'View Pending Txns',
            'View Blocks',
            'View Uncles',
            'Forked Blocks'
          ]
        case 'TOKENS':
          return ['View Tokens', 'View Token Transfers']
        case 'MISC':
          return ['Network Stats']
      }
      return ['']
    }
  },
  created() {
    console.log(this.$router)
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
    toggleToolbar(item = '') {
      if (item !== '') {
        if (item !== this.activeToolbarItem) {
          // Expand toolbar
          this.expandToolbar = true
          this.activeToolbarItem = item
        } else {
          // Collapse toolbar
          this.expandToolbar = false
          this.activeToolbarItem = ''
        }
      } else {
        this.activeToolbarItem = item
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
        if (Tokens.getToken(str.toLowerCase())) {
          // matches token hash
          this.$router.push({
            name: 'Token',
            params: { hash: str.toLowerCase() }
          })
          this.search = ''
        } else {
          // must be an account/contract
          this.$router.push({
            name: 'Address',
            params: { hash: str.toLowerCase() }
          })
          this.search = ''
        }
      } else if (hash.test(str)) {
        console.log('search: is hash')
        // is block or txn hash
        // check if block hash
        axios
          .post(this.$store.state.rpc, {
            jsonrpc: '2.0',
            method: 'eth_getBlockByHash',
            params: [str, false],
            id: 1
          })
          .then((response) => {
            if (response.data.result) {
              // is block hash
              this.$router.push({
                name: 'Block',
                params: {
                  number: common.hexToDecimal(response.data.result.number)
                }
              })
              this.search = ''
            } else {
              // check if txn hash
              axios
                .post(this.$store.state.rpc, {
                  jsonrpc: '2.0',
                  method: 'eth_getTransactionByHash',
                  params: [str],
                  id: 2
                })
                .then((response) => {
                  if (response.data.result) {
                    // is txn hash
                    this.$router.push({
                      name: 'Transaction',
                      params: { hash: str.toLowerCase() }
                    })
                    this.search = ''
                  } else {
                    // hash is not valid txn or block hash
                    console.log('Search: invalid block/txn hash')
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
        this.$router.push({ name: 'Block', params: { number: str } })
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
