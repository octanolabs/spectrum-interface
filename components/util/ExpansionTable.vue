<template>
  <v-data-table
    hide-default-header
    :items="items"
    :headers="headers"
    :loading="loading"
    :options="options"
    :class="{ 'body-2': dense }"
    dense
  >
    <template v-slot:top>
      <!-- With v-bind=$attrs" on breadcrumb-spinner we can optionally turn off path or spinner or both-->
      <breadcrumb-spinner
        v-bind="$attrs"
        :loading="loading"
        @refresh="$emit('refresh')"
      />
      <v-card tile class="pa-0">
        <v-card-text class="px-6 py-1">
          <small>
            <slot
              v-if="items.length > 0 && !loading"
              name="topMessage"
              v-bind="items"
            ></slot>
          </small>
        </v-card-text>
      </v-card>
    </template>
    <template v-slot:header="{ props: { headers: headeritems } }">
      <thead>
        <v-expansion-panels readonly class="expansion-table-header">
          <v-expansion-panel>
            <v-expansion-panel-header style="border: 1px solid #2e2e2e">
              <v-col
                v-for="({ text: headerText }, idx) in headeritems"
                :key="idx"
              >
                {{ headerText }}
              </v-col>
              <template v-slot:actions>
                <v-icon color="transparent">mdi-chevron-up</v-icon>
              </template>
            </v-expansion-panel-header>
          </v-expansion-panel>
        </v-expansion-panels>
      </thead>
    </template>

    <template v-if="loading" v-slot:body="{ pagination: { itemsPerPage } }">
      <tbody>
        <v-skeleton-loader
          style="padding: 16px 16px 0"
          :type="`list-item-two-line@${itemsPerPage}`"
        />
      </tbody>
    </template>

    <template v-else v-slot:body="{ items: tableitems, headers: tableheaders }">
      <v-expansion-panels flat hover>
        <v-expansion-panel
          v-for="(item, rowIndex) in tableitems"
          :key="rowIndex"
        >
          <v-expansion-panel-header>
            <div class="d-flex justify-space-around">
              <v-col
                v-for="({ value: headerKey }, index) in tableheaders"
                :key="index"
              >
                <slot
                  :name="`item.${headerKey}`"
                  v-bind="{ value: item[headerKey], item: item }"
                >
                  {{ `item.${headerKey}` }}
                </slot>
              </v-col>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <slot name="expanded-item" v-bind="{ item: item }"></slot>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-data-table>
</template>

<script>
import BreadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'

export default {
  components: {
    BreadcrumbSpinner,
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    headers: {
      type: Array,
      required: true,
      default: () => [],
    },
    options: {
      // Table options
      type: Object,
      default: () => {
        return {
          page: 1,
          itemsPerPage: 25,
        }
      },
    },
    dense: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style lang="scss" scoped>
.expansion-table-header {
  .v-expansion-panel {
    color: rgba(255, 255, 255, 0.5);
    button {
      cursor: default;
    }
  }
}
</style>
