<template>
  <!--  Datacard is a helper component to visualize Objects (blocks, tx, etc). Optionally tabs can be specified to split up content.
        It receives an object that is passed to all the slots.
        the component should be passed scoped slots, named like this:
        <template v-slot:[tab].[slotName].[key]></template>
        slotName can be anything at all
        key slot is optional as the default content for the key slots will be a normalized string from slot name
        -->

  <v-card>
    <v-card-title>
      <breadcrumbSpinner :loading="loading" @refresh="$emit('refresh')" />
    </v-card-title>
    <v-card-text class="body-2">
      <v-tabs>
        <v-tab v-for="tab in tabSlots()" :key="tab">
          {{ tab | toSentenceCaseText }}
        </v-tab>
        <v-tab-item v-for="tab in tabSlots()" :key="tab" eager>
          <v-row justify="center">
            <v-col cols="10">
              <v-row v-for="slot of slotsWithTab(tab)" :key="slot">
                <v-col cols="3">
                  <slot v-bind="item" :name="slot + '.key'">
                    {{
                      slot | stripTabAndKey | toSentenceCaseText | capitalize
                    }}:
                  </slot>
                </v-col>
                <v-col cols="8">
                  <slot v-bind="item" :name="slot" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script>
import breadcrumbSpinner from '~/components/BreadcrumbSpinner.vue'

export default {
  components: {
    breadcrumbSpinner
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
    }
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {
        return { test: 'default' }
      }
    },
    loading: {
      type: Boolean,
      required: false,
      default: () => {
        return false
      }
    }
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
        // Destructure and remove first elem that refers to tabs
        const [tab, slot, ,] = i.split('.')

        s[`${tab}.${slot}`] = null
      }
      return Object.keys(s)
    },
    slotsWithTab(selectedTab) {
      return this.slots()
        .map((s) => {
          const [tab, , ,] = s.split('.')

          return [tab, s]
        })
        .filter(([tab, ,]) => tab.includes(selectedTab))
        .map(([, slot]) => slot)
    }
  }
}
</script>
