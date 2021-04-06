<template>
  <v-col cols="12" class="pa-0">
    <breadcrumb-spinner no-loading />
    <v-list>
      <v-list-item dense>
        <v-list-item-content class="py-0">
          <v-list-item-title>Ubiq Supply API</v-list-item-title>
          <v-list-item-subtitle>
            This API lets you retrieve the UBQ supply
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-row no-gutters>
            <copy-to-clipboard
              :copy="endpoint + '?supplyOnly=true'"
              btn-size="x-small"
              type="text"
              :content="endpoint"
            />
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-icon
                  small
                  :color="online ? 'primary' : 'secondary'"
                  v-on="on"
                >
                  mdi-wifi
                </v-icon>
              </template>
              <span>Status: {{ online ? 'online' : 'offline' }}</span>
            </v-tooltip>
          </v-row>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <small class="px-4">
      This GET API exists for marketcap calculations. Supply is updated per
      block and returned in whole UBQ as a string. Ubiq was fair launched,
      circulating supply equals total supply.
    </small>
    <v-subheader>Response</v-subheader>
    <v-card class="ma-1 code-card" outlined>
      <v-card-text class="pa-0">
        <pre
          v-highlightjs="supply"
        ><code class="javascript w-100 elevation-0" /></pre>
      </v-card-text>
    </v-card>
    <v-subheader>Request</v-subheader>
    <v-card class="ma-1 code-card" outlined>
      <v-card-actions>
        <v-subheader>Curl</v-subheader>
        <v-spacer />
        <copy-to-clipboard :copy="curl" tooltip="left" color="primary" />
      </v-card-actions>
      <v-divider />
      <v-card-text class="pa-0">
        <pre
          v-highlightjs="curl"
        ><code class="javascript w-100 elevation-0"></code></pre>
      </v-card-text>
    </v-card>
    <v-card class="ma-1 code-card" outlined>
      <v-card-actions>
        <v-subheader>Axios</v-subheader>
        <v-spacer />
        <copy-to-clipboard :copy="axios" tooltip="left" color="primary" />
      </v-card-actions>
      <v-divider />
      <v-card-text class="pa-0">
        <pre
          v-highlightjs="axios"
        ><code class="javascript w-100 elevation-0"></code></pre>
      </v-card-text>
    </v-card>
  </v-col>
</template>

<script>
import axios from 'axios'
import stringifyObject from 'stringify-object'
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import CopyToClipboard from '~/components/apis/copy2clipboard'
import config from '~/params/config.json'

export default {
  components: {
    breadcrumbSpinner,
    CopyToClipboard,
  },
  data() {
    return {
      online: true,
      endpoint: config.api + '/v3/status',
      apiTab: null,
      tabs: ['Request', 'Response'],
      supplyRaw: '0',
    }
  },
  computed: {
    supply() {
      return '"' + this.supplyRaw + '"' || '0'
    },
    curl() {
      return (
        'curl -H "Content-Type: application/json" -X GET "' +
        this.endpoint +
        '?supplyOnly=true' +
        '"'
      )
    },
    axios() {
      return (
        'axios.request(' +
        stringifyObject(
          {
            method: 'get',
            url: this.endpoint + '?supplyOnly=true',
          },
          {
            indent: '  ',
            singleQuotes: false,
            inlineCharacterLimit: 12,
          }
        ) +
        ')'
      )
    },
  },
  created() {
    this.getSupply()
  },
  methods: {
    async getSupply() {
      const [{ data }] = await Promise.all([
        axios.request({
          method: 'get',
          url: 'https://api.ubiqscan.io/v3/status?supplyOnly=true',
        }),
      ])
      this.supplyRaw = data
    },
  },
}
</script>
