<template>
  <v-card flat color="#303030">
    <v-card-title>
      <v-spacer />
      <v-menu nudge-bottom="40">
        <template v-slot:activator="{ on }">
          <v-btn dark text v-on="on">
            <h4>{{ viewType }}</h4>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="hasInputData" @click="viewType = 'Default view'">
            Default view
          </v-list-item>
          <v-list-item @click="viewType = 'Original'">
            Original
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-text>
      <template v-if="viewType === 'Default view'">
        <pre>
Function: {{ inputData.function }}

MethodID: {{ inputData.methodId }}
<span v-for="(item, index) in inputData.params" :key="index">[{{ index }}]:  {{ item }}
</span>
</pre>
      </template>
      <template v-if="viewType === 'Original'">
        <p>{{ inputString }}</p>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    inputData: {
      type: Object,
      required: false,
      default: () => {}
    },
    inputString: {
      type: String,
      required: true,
      default: () => {}
    },
    hasInputData: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      viewType: 'Original'
    }
  },
  watch: {
    hasInputData(val) {
      if (val) {
        this.viewType = 'Default view'
      }
    }
  }
}
</script>
