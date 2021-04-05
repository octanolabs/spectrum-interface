<template>
  <v-card class="ma-1" outlined>
    <v-card-title v-if="name || item.name">
      <v-subheader class="pa-0">{{ name || item.name }}</v-subheader>
      <v-spacer />
      <v-tooltip v-if="schema.oneOf" left>
        <template v-slot:activator="{ on }">
          <v-btn icon color="secondary" v-on="on">
            <v-icon small>mdi-radiobox-marked</v-icon>
          </v-btn>
        </template>
        <span>One Of</span>
      </v-tooltip>
      <v-tooltip v-if="item.required === true" left>
        <template v-slot:activator="{ on }">
          <v-btn icon color="secondary" v-on="on">
            <v-icon small>mdi-asterisk</v-icon>
          </v-btn>
        </template>
        <span>Required</span>
      </v-tooltip>
    </v-card-title>
    <v-card-text class="text-left">
      <p v-if="item.description" v-html="item.description" />
      <p v-else-if="desc" v-html="desc" />
    </v-card-text>
    <v-card-actions v-if="!schema.oneOf">
      <v-chip small label color="primary">{{ schema.type }}</v-chip>
      <v-spacer />
      <v-chip v-if="schema.pattern" pill small color="secondary">{{
        schema.pattern
      }}</v-chip>
      <v-chip v-if="schema.enum" pill small color="secondary">{{
        schema.enum.toString()
      }}</v-chip>
    </v-card-actions>
    <v-flex v-if="schema.oneOf">
      <v-card v-for="(item, i) in schema.oneOf" :key="i" class="ma-2" outlined>
        <v-card-title class="pa-0">
          <v-subheader class="pa-0">{{ item.name }}</v-subheader>
        </v-card-title>
        <v-card-text class="text-left">
          <p v-if="item.description" v-html="item.description" />
        </v-card-text>
        <v-card-actions>
          <v-chip small label color="primary">{{ item.type }}</v-chip>
          <v-spacer />
          <v-chip v-if="item.pattern" pill small color="secondary">{{
            item.pattern
          }}</v-chip>
          <v-flex v-if="item.enum" text-right>
            <v-chip
              v-for="(str, i) in item.enum"
              :key="i"
              pill
              small
              color="secondary"
              style="margin-left: 2px"
            >
              {{ str }}
            </v-chip>
          </v-flex>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-card>
</template>

<script>
export default {
  props: {
    item: {
      // Param or Schema object (dereffed)
      required: true,
      type: Object,
    },
    name: {
      // pass name if item == openrpc.components.schemas[n]
      type: String,
      default: '',
    },
  },
  computed: {
    desc() {
      return this.item.description || this.item.schema.description
    },
    schema() {
      return this.item.schema || this.item
    },
  },
}
</script>
