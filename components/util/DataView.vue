<template>
  <!--  DataView is a helper component to visualize Objects (blocks, tx, etc). Optionally tabs can be specified to split up content.
        It receives an object that is passed to all the slots.
        the component should be passed scoped slots, named like this:
        <template v-slot:[tab].[slotName].[key]></template>
        slotName can be anything at all
        key slot is optional as the default content for the key slots will be a normalized string from slot name
        a slot which has for name just the tab identifier ( v-slot:[tab]) will just outlet all content to tab without adding layout
        any slot named "hr" will add an horizontal ruler
        -->

  <v-card flat class="pa-0">
    <v-card-title class="pa-0 mb-2">
      <breadcrumbSpinner v-bind="$attrs" no-loading />
    </v-card-title>
    <v-card-text class="pa-0">
      <v-tabs show-arrows :value="activeTab">
        <v-tab v-for="tab in tabSlots()" :key="tab" :href="`#${tab}`">
          {{ tab | toSentenceCaseText }}
        </v-tab>
        <v-tab-item v-for="tab in tabSlots()" :key="tab" :value="tab" eager>
          <!-- If the selected tab has at least one slot, use normal layout-->
          <v-col v-if="slotsWithTab(tab).length > 0" cols="12">
            <v-row v-for="slot of slotsWithTab(tab)" :key="slot" class="pa-0">
              <template v-if="slot.includes('.hr')">
                <v-col cols="12" class="pa-1">
                  <slot :name="slot">
                    <hr />
                  </slot>
                </v-col>
              </template>
              <template v-else>
                <v-col cols="4" class="px-4 py-1">
                  <slot v-bind="item" :name="slot + '.key'">
                    {{
                      slot | stripTabAndKey | toSentenceCaseText | capitalize
                    }}:
                  </slot>
                </v-col>
                <v-col cols="8" class="pa-1">
                  <!-- TODO: make this animation better -->
                  <v-skeleton-loader v-if="loading" type="text" />
                  <slot v-else v-bind="item" :name="slot" />
                </v-col>
              </template>
            </v-row>
          </v-col>
          <!-- Else, dump all content with no layout-->
          <v-col v-else cols="12" class="pa-1">
            <slot :name="tab" v-bind="item"></slot>
          </v-col>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'

export default {
  components: {
    breadcrumbSpinner,
  },
  filters: {
    stripTabAndKey(value) {
      if (!value) return ''
      value = value.toString()
      const [, slot] = value.split('.')
      return slot
    },
    toSentenceCaseText(value) {
      // "parentHash" -> "parent Hash"
      if (!value) return ''
      value = value.toString()

      const result = value.replace(/([A-Z])/g, ' $1')

      return result.charAt(0).toUpperCase() + result.slice(1)
    },
    capitalize(value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
  },
  props: {
    item: {
      type: [Object, Array],
      required: true,
      default: () => {
        return { test: 'default' }
      },
    },
    activeTab: {
      type: String,
      default: () => '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    tabSlots() {
      const tabs = {}
      for (const s of Object.keys(this.$scopedSlots).filter(
        (s) => !s.includes('default')
      )) {
        const [tab, ,] = s.split('.')
        tabs[tab] = null
      }
      return Object.keys(tabs)
    },
    slots() {
      const s = {}
      for (const i of Object.keys(this.$scopedSlots).filter(
        (s) => !s.includes('default')
      )) {
        // Destructure each slot and check if there are tabs without slots
        const [tab, slot, ,] = i.split('.')

        if (slot !== undefined) {
          s[`${tab}.${slot}`] = null
        }
      }
      return Object.keys(s)
    },
    slotsWithTab(selectedTab) {
      return this.slots().filter((s) => {
        const [tab, ,] = s.split('.')

        return tab === selectedTab
      })
    },
  },
}
</script>
