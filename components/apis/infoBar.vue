<template>
  <v-flex>
    <v-system-bar color="#222">
      <span>{{ info.title }} - {{ info.description }} </span>
      <div class="flex-grow-1"></div>
      <copy-to-clipboard
        :copy="endpoint"
        btn-size="x-small"
        type="text"
        :content="endpoint"
      />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-icon :color="online ? 'success' : 'error'" v-on="on"
            >mdi-wifi</v-icon
          >
        </template>
        <span>Status: {{ online ? 'online' : 'offline' }}</span>
      </v-tooltip>
    </v-system-bar>
  </v-flex>
</template>

<script>
import axios from 'axios'
import CopyToClipboard from '@/components/apis/copy2clipboard'

export default {
  components: {
    CopyToClipboard,
  },
  props: ['info', 'endpoint'],
  data() {
    return {
      online: false,
    }
  },
  watch: {
    endpoint() {
      this.checkApi()
    },
  },
  created() {
    this.checkApi()
  },
  methods: {
    checkApi() {
      // TODO - add additional types of checks, default should be rpc.discover.
      // for now however use web3_clientVersion, it applies to ubiq and etc (geth).
      axios
        .request({
          method: 'post',
          url: this.endpoint,
          data: {
            id: 1,
            jsonrpc: '2.0',
            method: 'web3_clientVersion',
            params: [],
          },
        })
        .then((response) => {
          if (response.data) {
            if (!response.data.error) {
              this.$store.commit('setClientVer', response.data.result)
              this.online = true
            } else {
              // web3_clientVersion likely unknown
              this.$store.commit('setClientVer', false)
              this.online = false
            }
          } else {
            this.online = false
          }
        })
        .catch((e) => {
          this.$store.commit('setClientVer', false)
          this.online = false
          this.$store.commit('addError', e)
        })
    },
  },
}
</script>
