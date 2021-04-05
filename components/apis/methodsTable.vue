<template>
  <v-card>
    <v-card-title>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
      <v-spacer />
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="data"
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
            :class="item.methodId === selectedId ? 'custom-highlight-row' : ''"
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
  </v-card>
</template>

<script>
export default {
  props: ['data', 'apiId'],
  data() {
    return {
      search: '',
      headers: [
        { text: '#', value: 'methodId', align: 'left' },
        { text: 'Method', value: 'name', align: 'left' },
        { text: 'Summary', value: 'summary', align: 'left' },
        { text: 'Params', value: 'params', align: 'center' },
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
