<template>
  <v-col cols="12" class="pa-0">
    <breadcrumbSpinner v-bind="$attrs" no-loading />
    <v-flex>
      <v-sheet v-if="deref" style="width: 100%; overflow: hidden">
        <v-list>
          <v-list-item dense>
            <v-list-item-content class="py-0">
              <v-list-item-title>{{ deref.info.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ deref.info.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-row no-gutters>
                <copy-to-clipboard
                  :copy="endpoint"
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
          <v-list-item dense>
            <v-list-item-content>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search Methods"
                single-line
                hide-details
              />
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-data-table
          :headers="headers"
          :items="deref.methods"
          item-key="methodId"
          :search="search"
          disable-pagination
          hide-default-footer
          class="highlight-row"
        >
          <template v-slot:body="{ items }">
            <tbody>
              <tr
                v-for="item in items"
                :key="item.methodId"
                :class="
                  item.methodId === selectedId ? 'custom-highlight-row' : ''
                "
                @click.stop="rowSelected(item)"
              >
                <td class="text-left">{{ item.methodId + 1 }}</td>
                <td class="text-left">{{ item.name }}</td>
                <td class="text-left">{{ item.summary }}</td>
                <td class="text-center">{{ item.params.length }}</td>
              </tr>
            </tbody>
          </template>
        </v-data-table>
        <right-drawer :api-id="apiId" />
      </v-sheet>
    </v-flex>
  </v-col>
</template>

<script>
import axios from 'axios'
import JSRP from 'json-schema-ref-parser'
import CopyToClipboard from '~/components/apis/copy2clipboard'
import RightDrawer from '~/components/apis/rightDrawer'
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import gubiq from '~/openrpc/gubiq.json'

export default {
  name: 'D0x',
  components: {
    breadcrumbSpinner,
    CopyToClipboard,
    RightDrawer,
  },
  async asyncData({ params, store }) {
    const api = params.api
    let url = process.env.config.rpcUrl
    let json = null
    let online = false

    if (api === 'spectrum') {
      url = process.env.config.apiUrl
    }
    const {
      data: { result },
    } = await axios.post(url, {
      jsonrpc: '2.0',
      method: 'rpc_discover',
      params: [],
      id: 1,
    })

    if (result) {
      online = true
    }

    let openrpc = null
    if (api === 'spectrum') {
      openrpc = {}
    } else {
      openrpc = gubiq
    }

    // JSON deep copy fuckery to prevent deref referencing payload.json (we don't want the deref going back to schema)
    const deref = await JSRP.dereference(JSON.parse(JSON.stringify(openrpc)))
    if (deref) {
      const methods = deref.methods
      // add a numeric ID to each method
      let count = 0
      for (const method of methods) {
        method.methodId = count
        methods[count] = method
        count++
      }
      deref.method = methods
      json = deref
    }
    store.dispatch('apis/setOpenRpcDocument', {
      apiId: api,
      schema: null,
      deref: json,
    })
    return { deref: json, endpoint: url, apiId: api, online }
  },
  data() {
    return {
      search: '',
      headers: [
        { text: '#', value: 'methodId', align: 'left', sortable: false },
        { text: 'Method', value: 'name', align: 'left', sortable: false },
        { text: 'Summary', value: 'summary', align: 'left', sortable: false },
        { text: 'Params', value: 'params', align: 'center', sortable: false },
      ],
    }
  },
  computed: {
    selectedId() {
      return this.$store.state.apis[this.apiId].openrpc.selected || 0
    },
  },
  methods: {
    rowSelected(item) {
      this.$store.dispatch('apis/setSelectedMethod', {
        apiId: this.apiId,
        method: item.methodId,
      })
      if (!this.$store.state.apis.drawers.right) {
        this.$store.dispatch('apis/toggleDrawer')
      }
    },
  },
}
</script>
