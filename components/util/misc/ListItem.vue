<template>
  <v-list-item style="border-bottom: 1px solid #272727">
    <v-list-item-action>
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
        </template>
        <span>
          {{ tooltip }}
        </span>
      </v-tooltip>
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>{{ title }}</v-list-item-title>
      <v-list-item-subtitle>
        <slot name="subtitle" />
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action>
      <slot name="action" />
    </v-list-item-action>
  </v-list-item>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default() {
        return ''
      },
    },
    tooltip: {
      type: String,
      default() {
        return ''
      },
    },
  },
}
</script>
