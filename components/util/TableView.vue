<template>
  <!--  TODO: We can make items searchable with prop 'search'-->
  <v-data-table
    :items="items"
    :headers="headers"
    :loading="loading"
    :hide-default-header="loading"
    :options="options"
    :item-key="itemKey"
    :class="{ 'body-2': dense }"
  >
    <template v-slot:top>
      <!-- With v-bind=$attrs" on breadcrumb-spinner we can optionally turn off path or spinner or both-->
      <breadcrumb-spinner
        v-bind="$attrs"
        :loading="loading"
        @refresh="$emit('refresh')"
      />
      <v-card>
        <v-card-text>
          <slot
            v-if="items.length > 0 && !loading"
            name="topMessage"
            v-bind="items"
          ></slot>
        </v-card-text>
      </v-card>
    </template>
    <!-- Skeleton loaders -->
    <template v-slot:progress>
      <!-- if we use the table's default progress bar it is placed above the header skeleton loader.
           Fix is replace it with an empty div and add it back in the header slot
     -->
      <div></div>
    </template>
    <template v-if="loading" v-slot:body="{ pagination: { itemsPerPage } }">
      <tbody v-if="items.length === 0">
        <v-skeleton-loader type="table-tbody" />
      </tbody>
      <tbody v-else>
        <v-skeleton-loader
          style="padding: 16px 16px 0;"
          :type="`table-row-divider@${itemsPerPage}`"
        />
      </tbody>
    </template>
    <template v-if="loading" v-slot:header>
      <v-skeleton-loader type="table-thead"></v-skeleton-loader>
      <div style="padding: 0 16px;">
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </div>
    </template>
    <!--    <template v-if="loading" v-slot:item>-->
    <!--      <tr>-->
    <!--        <v-skeleton-loader type="table-row"></v-skeleton-loader>-->
    <!--      </tr>-->
    <!--    </template>-->
    <!-- -->
    <template v-slot:no-data>
      <v-icon>mdi-table-cancel</v-icon> looks like there's nothing here.
    </template>

    <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </v-data-table>
</template>

<script>
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import common from '~/scripts/common'

export default {
  components: {
    breadcrumbSpinner
  },
  inheritAttrs: false,
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
    dense: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    formatNumber(n) {
      return common.formatNumber(n)
    }
  }
}
</script>
