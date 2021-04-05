<template>
  <v-col cols="12" class="pa-0">
    <breadcrumbSpinner v-bind="$attrs" no-loading />
    <v-flex>
      <v-sheet v-if="deref" style="width: 100%; overflow: hidden">
        <openrpc-methods :data="deref.methods" :api-id="apiId" />
        <right-drawer :api-id="apiId" />
      </v-sheet>
    </v-flex>
  </v-col>
</template>

<script>
// import axios from 'axios'
import JSRP from 'json-schema-ref-parser'
import OpenrpcMethods from '~/components/apis/methodsTable'
import RightDrawer from '~/components/apis/rightDrawer'
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import gubiq from '~/openrpc/gubiq.json'

export default {
  name: 'd0x',
  components: {
    breadcrumbSpinner,
    OpenrpcMethods,
    RightDrawer,
  },
  async asyncData({ params, store }) {
    const api = params.api
    let url = process.env.config.rpcUrl
    let json = null
    if (api === 'spectrum') {
      url = process.env.config.apiUrl
    }
    /* const {
      data: { result },
    } = await axios.post(url, {
      jsonrpc: '2.0',
      method: 'rpc_discover',
      params: [],
      id: 1,
    }) */
    // JSON deep copy fuckery to prevent deref referencing payload.json (we don't want the deref going back to schema)
    const deref = await JSRP.dereference(JSON.parse(JSON.stringify(gubiq)))
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
    console.log(gubiq)
    return { deref: json, endpoint: url, apiId: api }
  },
}
</script>
