<template>
  <v-flex>
    <v-sheet style="width: 100%; overflow: hidden; padding: 15px">
      <v-chip class="mb-2" label small color="secondary">
        {{ selected.name }}
      </v-chip>
      <p v-if="selected.description" class="pa-0">
        {{ selected.description }}
      </p>
      <p v-else class="pa-0">
        {{ selected.summary }}
      </p>
    </v-sheet>
    <v-sheet style="width: 100%; overflow: hidden">
      <v-tabs v-model="apiTab" grow>
        <v-tab v-for="tab in tabs" :key="tab" ripple>
          {{ tab }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="apiTab">
        <v-tab-item key="Request">
          <v-expansion-panels
            accordion
            class="elevation-0 pa-0"
            multiple
            :value="panels.request"
          >
            <v-expansion-panel>
              <v-expansion-panel-header ripple>
                <div>
                  Params
                  <v-chip v-if="selected.params" small color="primary"
                    ><span class="white--text">{{
                      selected.params.length
                    }}</span></v-chip
                  >
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content style="overflow-x: auto">
                <v-flex v-for="(item, i) in selected.params" :key="i">
                  <openrpc-param :item="item" />
                </v-flex>
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header ripple>
                Examples
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <openrpc-request
                  mode="curl"
                  :endpoint="url"
                  :method="selected.name"
                  :params="selected.params"
                />
                <openrpc-request
                  mode="axios"
                  :endpoint="url"
                  :method="selected.name"
                  :params="selected.params"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tab-item>
        <v-tab-item key="Response">
          <v-expansion-panels
            accordion
            class="elevation-0 pa-0"
            multiple
            :value="panels.response"
          >
            <v-expansion-panel>
              <v-expansion-panel-header ripple>
                Returns
              </v-expansion-panel-header>
              <v-expansion-panel-content
                v-if="selected.result"
                style="overflow-x: auto"
              >
                <openrpc-param :item="selected.result" />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-header ripple>
                Example
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <openrpc-response :result="selected.result" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tab-item>
      </v-tabs-items>
    </v-sheet>
  </v-flex>
</template>

<script>
import OpenrpcParam from '@/components/apis/cards/Param'
import OpenrpcRequest from '@/components/apis/cards/Request'
import OpenrpcResponse from '@/components/apis/cards/Response'

export default {
  // selected method
  components: {
    OpenrpcParam,
    OpenrpcRequest,
    OpenrpcResponse,
  },
  props: {
    selected: {
      type: Object,
      default() {
        return {}
      },
    },
    apiId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      apiTab: null,
      tabs: ['Request', 'Response'],
      panels: {
        request: [0, 1],
        response: [0, 1],
      },
    }
  },
  computed: {
    url() {
      return this.$store.state.apis[this.apiId].info.url
    },
  },
}
</script>
