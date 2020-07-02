<template>
  <div>
    <v-sheet v-if="loading" min-height="200px">
      <div class="d-flex justify-center align-center" style="height: 200px;">
        <v-col cols="2" class="d-flex justify-center">
          <v-progress-circular size="100" color="primary" indeterminate />
        </v-col>
      </div>
    </v-sheet>
    <v-sheet v-else min-height="200px">
      <v-item-group v-model="activeItems" multiple>
        <v-row justify="center">
          <v-col cols="1"></v-col>
          <v-spacer />
          <v-col v-for="(slot, idx) in slots" :key="idx" md="2">
            <v-item v-slot:default="{ active, toggle }">
              <v-btn :color="active ? 'primary' : ''" text @click="toggle">
                <v-scroll-x-transition hide-on-leave>
                  <div v-if="active" class="flex-grow-1 text-center">
                    {{ slot.charAt(0).toUpperCase() + slot.slice(1) }}
                  </div>
                </v-scroll-x-transition>

                <template v-if="!active" class="flex-grow-1 text-center">
                  {{ slot.charAt(0).toUpperCase() + slot.slice(1) }}
                </template>
              </v-btn>
              <!--              <v-card-->
              <!--                :color="active ? 'primary' : ''"-->
              <!--                class="d-flex align-center"-->
              <!--                dark-->
              <!--                min-height="25px"-->
              <!--                style="padding: 5px 0;"-->
              <!--                outlined-->
              <!--                elevation="6"-->
              <!--                @click="toggle"-->
              <!--              >-->
              <!--                <v-scroll-y-transition>-->
              <!--                  <div v-if="active" class="flex-grow-1 text-center">-->
              <!--                    {{ slot.charAt(0).toUpperCase() + slot.slice(1) }}-->
              <!--                  </div>-->
              <!--                  <div v-else class="flex-grow-1 text-center">-->
              <!--                    {{ slot.charAt(0).toUpperCase() + slot.slice(1) }}-->
              <!--                  </div>-->
              <!--                </v-scroll-y-transition>-->
              <!--              </v-card>-->
            </v-item>
          </v-col>
          <v-spacer />
          <!--          <v-col cols="1">-->
          <!--            <div class="d-flex justify-space-around">-->
          <!--              <v-btn icon><v-icon>mdi-backup-restore</v-icon></v-btn>-->
          <!--            </div>-->
          <!--          </v-col>-->
        </v-row>
      </v-item-group>
      <v-row justify="center">
        <v-col>
          <template v-for="(slot, idx) in slots">
            <v-scroll-x-transition :key="idx">
              <div v-if="activeItems.includes(idx)" class="d-flex">
                <v-col>
                  <slot :name="slot"></slot>
                </v-col>
              </div>
            </v-scroll-x-transition>
          </template>
          <div class="d-flex justify-center">
            <span>No charts selected</span>
          </div>
        </v-col>
      </v-row>
    </v-sheet>
  </div>
</template>

<script>
export default {
  name: 'ChartsDisplay',
  props: {
    loading: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      activeItems: [],
    }
  },
  computed: {
    activeCharts() {
      return this.activeItems.map((i) => {
        return this.slots[i]
      })
    },
    slots() {
      return Object.keys(this.$scopedSlots).filter((s) => {
        return !s.includes('default')
      })
    },
  },
}
</script>
