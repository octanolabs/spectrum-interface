<template>
  <!--  TODO: We can make items searchable with prop 'search'-->
  <v-data-table
    :items="items"
    :headers="headers"
    :loading="loading"
    :options="options"
    :item-key="itemKey"
  >
    <template v-slot:top>
      <breadcrumb-spinner :loading="loading" @refresh="$emit('refresh')" />
      <v-card>
        <v-card-text>
          <slot name="topMessage"></slot>
        </v-card-text>
      </v-card>
    </template>
    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </v-data-table>
</template>

<script>
import breadcrumbSpinner from '~/components/BreadcrumbSpinner.vue'
import common from '~/scripts/common'

export default {
  components: {
    breadcrumbSpinner
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    itemKey: {
      // Unique key for each row item; if not present can mess up certain features (expanded rows)
      type: String,
      required: true,
      default: () => {
        return ''
      }
    },
    headers: {
      type: Array,
      required: true,
      default: () => {
        return [{ text: 'Default' }]
      }
    },
    options: {
      // Table options
      type: Object,
      default: () => {
        return {
          page: 1,
          itemsPerPage: 15
        }
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  methods: {
    formatNumber(n) {
      return common.formatNumber(n)
    }
  }
}
</script>
