<template>
  <v-list v-bind="$attrs">
    <v-list-item v-for="(item, idx) in items" :key="idx" two-line>
      <v-skeleton-loader
        v-if="loading"
        type="chip, list-item-two-line"
      ></v-skeleton-loader>
      <slot v-else v-bind="item"></slot>
      <hr style="margin: 5px 0 3px 0" />
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  name: 'PreviewList',
  props: {
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
