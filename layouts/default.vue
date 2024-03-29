<template>
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
      <v-avatar size="36" class="ml-4">
        <v-img :src="require('~/assets/logo.svg')" />
      </v-avatar>
    </v-app-bar>
    <!-- nav drawer -->
    <v-navigation-drawer v-model="drawer" fixed app class="abstract-drawer">
      <v-toolbar style="background-color: #272727">
        <v-list dense class="pa-0">
          <v-list-item class="pl-0">
            <v-list-item-avatar size="48">
              <img src="../assets/ubiq.png" height="24" width="24" size="24" />
            </v-list-item-avatar>
            <v-list-item-content class="text-right">
              <h1 style="color: #6fceb7">ubiqscan</h1>
              <v-list-item-subtitle style="color: #e76754">
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
          <template v-if="pLinks">
            <v-list-item
              v-for="([title, icon, path], i) in pData"
              :key="i"
              link
              style="padding-left: 56px"
              :href="path"
              target="_blank"
            >
              <v-list-item-title v-text="title"></v-list-item-title>
              <v-list-item-icon>
                <v-icon small v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </template>
          <template v-if="!pLinks">
            <v-list-item
              v-for="([title, icon, path], i) in pData"
              :key="i"
              link
              style="padding-left: 56px"
              :to="path"
            >
              <v-list-item-title v-text="title"></v-list-item-title>
              <v-list-item-icon>
                <v-icon small v-text="icon"></v-icon>
              </v-list-item-icon>
            </v-list-item>
          </template>
        </v-list-group>
      </v-list>
      <template v-slot:append>
        <v-list dense>
          <v-list-item
            link
            :href="'https://shinobi-info.ubiq.ninja'"
            target="_blank"
          >
            <v-list-item-avatar tile size="24">
              <v-img :src="require('~/assets/shinobi.svg')" height="24" />
            </v-list-item-avatar>
            <v-list-item-title>Shinobi Info</v-list-item-title>
          </v-list-item>
          <v-list-item
            link
            :href="'https://watchtheburn.ubiqsmart.com'"
            target="_blank"
          >
            <v-list-item-avatar tile size="24">
              <v-icon>mdi-fire</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Gas Monitor</v-list-item-title>
          </v-list-item>
          <v-list-item link :href="'https://stats.ubiqscan.io'" target="_blank">
            <v-list-item-avatar tile size="24">
              <v-icon>mdi-gauge</v-icon>
            </v-list-item-avatar>
            <v-list-item-title>Network stats</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <notifications position="bottom right" group="normal" />

    <!-- Sizes your content based upon application components -->
    <!-- AppBar's smooth reflow doesn't play nice with nuxt's auto resizing shenanigans, this padding makes it so the content under the appbar is not moved-->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <nuxt></nuxt>
    </v-main>
    <v-footer padless app fixed height="22px" style="background-color: #6fceb7">
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
            <span style="margin-top: 2px">
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
            <span style="margin-top: 2px">{{ summary.difficulty }} TH</span>
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
            <span style="margin-top: 2px">
              {{ number.format(blockHeight) }}
            </span>
          </v-btn>
        </template>
        <span>Block Height: {{ number.format(blockHeight) }}</span>
      </v-tooltip>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios'
import common from '../scripts/common'

export default {
  data() {
    return {
      search: '',
      errors: [],
      drawer: false,
      items: [
        [
          'Accounts',
          'mdi-account-group',
          false,
          [
            ['Top', 'mdi-account-cash', '/accounts/top'],
            ['Recent', 'mdi-account-clock', '/accounts/recent'],
          ],
        ],
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
            ['Contract Calls', 'mdi-data-matrix-scan', '/transactions/calls'],
            [
              'Contract Deploys',
              'mdi-data-matrix-plus',
              '/transactions/contracts',
            ],
          ],
        ],
        [
          'Tokens',
          'mdi-diamond-stone',
          false,
          [
            ['ERC20', 'mdi-diamond-stone', '/tokens'],
            ['ERC20 Transfers', 'mdi-bank-transfer', '/tokentransfers'],
          ],
        ],
        [
          'Charts',
          'mdi-chart-box-outline',
          false,
          [
            ['Txns', 'mdi-bank-transfer', '/analytics/txns'],
            ['Blocks', 'mdi-cube-send', '/analytics/blocks'],
            ['Gas', 'mdi-gas-station-outline', '/analytics/gas'],
          ],
        ],
        [
          'Developers',
          'mdi-code-json',
          false,
          [
            ['Gubiq API', 'mdi-code-json', '/d0x/gubiq'],
            ['Supply API', 'mdi-calculator', '/docs/supply'],
            ['Persona', 'mdi-drama-masks', '/docs/persona'],
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
  },
  mounted() {
    this.onResize()

    window.addEventListener('resize', this.onResize, { passive: true })
  },
  async created() {
    this.onResize()
    await this.$store.dispatch('fetchStats')
    await this.$store.dispatch('fetchChainSummary')
    await this.$store.dispatch('tokens/getNativePriceUsd')
    if (!this.$store.state.mobile) {
      this.drawer = true
    }
    const self = this
    this.loop = setInterval(function () {
      self.now = self.$moment
      self.$store.dispatch('fetchStats')
      self.$store.dispatch('fetchChainSummary')
      self.$store.dispatch('tokens/getNativePriceUsd')
    }, process.env.config.pollData)
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
          name: 'address-account',
          params: { account: str.toLowerCase() },
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
                      name: 'tx-hash',
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
    onResize() {
      this.$store.dispatch('set_mobile', window.innerWidth < 600)
    },
  },
}
</script>

<style lang="scss">
::-webkit-scrollbar {
  width: 6px; /* for vertical scrollbars */
  height: 6px; /* for horizontal scrollbars */
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: #2e2e2e !important;
}

::-webkit-scrollbar-thumb {
  background: var(--v-primary-base) !important;
  border-radius: 3px;
}
</style>
