<template>
  <perfect-scrollbar style="height: 100%;" :options="{ suppressScrollX: true }">
    <v-app>
      <!-- app bar -->
      <v-app-bar app fixed>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-spacer />
        <v-input hide-details class="pt-2 mr-1">
          <v-text-field
            v-model="search"
            hide-details
            clearable
            type="text"
            label="Search by Address / Txhash / Block"
            append-outer-icon="mdi-magnify"
            @keydown="handleEvent"
            @click:append-outer="handleEvent"
          >
          </v-text-field>
        </v-input>
        <v-app-bar-nav-icon class="mr-1">
          <img src="../assets/logo.svg" width="26" height="26" />
        </v-app-bar-nav-icon>
      </v-app-bar>
      <!-- nav drawer -->
      <v-navigation-drawer v-model="drawer" fixed app class="abstract-drawer">
        <v-toolbar style="background-color: #272727;">
          <v-list dense class="pa-0">
            <v-list-item>
              <v-list-item-avatar>
                <img
                  src="../assets/logo.svg"
                  height="36px"
                  style="height: 36px;"
                />
              </v-list-item-avatar>
              <v-list-item-content class="text-right">
                <h1 style="color: #6fceb7;">spectrum</h1>
                <v-list-item-subtitle style="color: #e76754;">
                  block explorer
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-toolbar>
        <v-list dense>
          <v-list-item link to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-group
            v-for="([pTitle, pIcon, pLinks, pData], p) in items"
            :key="p"
            :prepend-icon="pIcon"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ pTitle }}</v-list-item-title>
            </template>
            <v-list-item
              v-for="([title, icon, path], i) in pData"
              :key="i"
              link
              style="padding-left: 56px;"
              :to="path"
            >
              <v-list-item-title v-text="title"></v-list-item-title>
              <v-list-item-icon>
                <v-icon small v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </v-list-group>
        </v-list>
        <template v-slot:append></template>
      </v-navigation-drawer>
      <notifications position="bottom right" group="normal" />

      <!-- Sizes your content based upon application components -->
      <!-- AppBar's smooth reflow doesn't play nice with nuxt's auto resizing shenanigans, this padding makes it so the content under the appbar is not moved-->
      <v-main>
        <!-- Provides the application the proper gutter -->
        <nuxt></nuxt>
      </v-main>
      <v-footer
        padless
        app
        fixed
        height="22px"
        style="background-color: #6fceb7;"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              tile
              style="
                height: 22px;
                display: flex;
                align-items: center;
                font-size: 12px;
              "
              v-on="on"
            >
              <span style="margin-top: 2px;">
                ${{ prices.ubq.usd.toFixed(3) }} @ {{ prices.ubq.btc }} BTC/UBQ
              </span>
            </v-btn>
          </template>
          <span>
            Price: ${{ prices.ubq.usd.toFixed(3) }} @
            {{ prices.ubq.btc }} BTC/UBQ
          </span>
        </v-tooltip>
        <v-spacer />
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              tile
              style="
                height: 22px;
                display: flex;
                align-items: center;
                font-size: 12px;
              "
              v-on="on"
            >
              <v-icon small class="mr-1">mdi-gauge</v-icon>
              <span style="margin-top: 2px;">
                {{ number.format(summary.hashrate) }} GH/s
              </span>
            </v-btn>
          </template>
          <span>Hashrate: {{ summary.hashrate }} GH/s</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              tile
              style="
                height: 22px;
                display: flex;
                align-items: center;
                font-size: 12px;
              "
              v-on="on"
            >
              <v-icon small class="mr-1">mdi-pickaxe</v-icon>
              <span style="margin-top: 2px;">
                {{ summary.difficulty }} TH
              </span>
            </v-btn>
          </template>
          <span>Difficulty: {{ summary.difficulty }} TH</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              text
              tile
              style="
                height: 22px;
                display: flex;
                align-items: center;
                font-size: 12px;
              "
              v-on="on"
            >
              <v-icon small class="mr-1">mdi-cube-scan</v-icon>
              <span style="margin-top: 2px;">
                {{ number.format(blockHeight) }}
              </span>
            </v-btn>
          </template>
          <span>Block Height: {{ number.format(blockHeight) }}</span>
        </v-tooltip>
      </v-footer>
    </v-app>
  </perfect-scrollbar>
</template>

<script>
import axios from 'axios'
import smoothReflow from 'vue-smooth-reflow'
import common from '../scripts/common'

export default {
  mixins: [smoothReflow],
  data() {
    return {
      search: '',
      errors: [],
      drawer: true,
      items: [
        [
          'Blocks', // title
          'mdi-cube-scan', // icon
          false, // external links
          [
            ['Accepted', 'mdi-check-box-outline', '/blocks'],
            ['Uncles', 'mdi-checkbox-multiple-blank-outline', '/uncles'],
            ['Reorgs', 'mdi-checkbox-blank-off-outline', '/forkedBlocks'],
          ], // child items [ title, icon, path ]
        ],
        [
          'Txns',
          'mdi-bank-transfer',
          false,
          [
            ['Latest', 'mdi-check', '/transactions/latest'],
            ['Pending', 'mdi-update', '/transactions/pending'],
            ['Failed', 'mdi-alert-circle-outline', '/transactions/failed'],
          ],
        ],
        [
          'Tokens',
          'mdi-diamond-stone',
          false,
          [
            ['Transfers', 'mdi-bank-transfer', '/tokentransfers'],
            ['View All', 'mdi-diamond-stone', '/tokens'],
          ],
        ],
        [
          'Contracts',
          'mdi-file-code-outline',
          false,
          [
            ['Calls', 'mdi-data-matrix-scan', '/transactions/calls'],
            ['Created', 'mdi-data-matrix-plus', '/transactions/contracts'],
          ],
        ],
        [
          'Charts',
          'mdi-chart-box-outline',
          false,
          [
            ['Txns', 'mdi-bank-transfer', '/analytics/charts'],
            ['Blocks', 'mdi-cube-send', '/transactions/contracts'],
            ['Gas', 'mdi-gas-station-outline', '/transactions/contracts'],
          ],
        ],
        [
          'Misc',
          'mdi-routes',
          true,
          [
            ['Network stats', 'mdi-gauge', 'https://ubiq.gojupiter.tech'],
            [
              'Shinobi info',
              'mdi-chart-areaspline-variant',
              'https://shinobi-info.ubiq.ninja',
            ],
          ],
        ],
      ],
      number: new Intl.NumberFormat('en', {}),
    }
  },
  computed: {
    blockHeight() {
      return this.$store.state.summary.blocks[0]?.number | 0
    },
    summary() {
      return this.$store.state.summary
    },
    prices() {
      return this.$store.state.prices
    },
  },
  mounted() {
    this.$smoothReflow()
  },
  methods: {
    handleEvent(e) {
      if (e instanceof KeyboardEvent) {
        if (e.code === 'Enter' || e.key === 'Enter') {
          this.submitSearch(this.search)
        }
      } else if (e instanceof MouseEvent) {
        this.submitSearch(this.search)
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
          params: { address: str.toLowerCase() },
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
            id: 1,
          })
          .then((response) => {
            if (response.data.result) {
              // is block hash
              this.$router.push({
                name: 'block-id',
                params: {
                  id: common.hexToDecimal(response.data.result.number),
                },
              })
              this.search = ''
            } else {
              // check if txn hash
              axios
                .post(process.env.config.rpcUrl, {
                  jsonrpc: '2.0',
                  method: 'eth_getTransactionByHash',
                  params: [str],
                  id: 2,
                })
                .then((response) => {
                  if (response.data.result) {
                    // is txn hash
                    this.$router.push({
                      name: 'transaction-hash',
                      params: { hash: str.toLowerCase() },
                    })
                    this.search = ''
                  } else {
                    // hash is not valid txn or block hash

                    this.$notify({
                      group: 'normal',
                      text:
                        '<span class="fa fa-search"/> Invalid Txn/Block Hash: ' +
                        str,
                      type: 'error',
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
          type: 'error',
        })
      }
    },
  },
}
</script>
