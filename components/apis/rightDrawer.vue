<template>
  <resizable-drawer v-if="methods" side="right">
    <v-flex>
      <v-toolbar class="elevation-0 drawer-toolbar">
        <v-btn icon @click.stop="closeDrawer">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title
          >Method ( {{ selected + 1 }} / {{ methods.length }} )</v-toolbar-title
        >
        <v-spacer />
        <v-btn icon :disabled="canSkipPrev()" @click.stop="prevOperation">
          <v-icon>mdi-skip-previous</v-icon>
        </v-btn>
        <v-btn icon :disabled="canSkipNext()" @click.stop="nextOperation">
          <v-icon>mdi-skip-next</v-icon>
        </v-btn>
      </v-toolbar>
    </v-flex>
    <method-details
      v-if="methods[selected]"
      :selected="methods[selected]"
      :apiId="apiId"
    />
  </resizable-drawer>
</template>

<script>
import MethodDetails from './methodDetails'
import ResizableDrawer from './resizableDrawer'

export default {
  components: {
    MethodDetails,
    ResizableDrawer,
  },
  props: ['apiId'],
  computed: {
    methods() {
      return this.$store.state.apis[this.apiId]
        ? this.$store.state.apis[this.apiId].openrpc.document.deref.methods
        : []
    },
    selected() {
      return this.$store.state.apis[this.apiId]
        ? this.$store.state.apis[this.apiId].openrpc.selected
        : 0
    },
  },
  methods: {
    closeDrawer() {
      this.$store.dispatch('apis/toggleDrawer')
    },
    canSkipPrev() {
      return !this.selected > 0
    },
    canSkipNext() {
      return this.selected >= this.methods.length - 1
    },
    prevOperation() {
      this.$store.dispatch('apis/setSelectedMethod', {
        apiId: this.apiId,
        method: this.selected - 1,
      })
    },
    nextOperation() {
      this.$store.dispatch('apis/setSelectedMethod', {
        apiId: this.apiId,
        method: this.selected + 1,
      })
    },
  },
}
</script>
