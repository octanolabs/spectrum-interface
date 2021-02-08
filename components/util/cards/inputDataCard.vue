<template>
  <v-card flat tile>
    <v-card-title class="py-0">
      <v-tooltip right>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on">mdi-information-outline</v-icon>
        </template>
        <span v-if="output">Information returned by a transaction.</span>
        <span v-else>
          Additional information that is required for the transaction.
        </span>
      </v-tooltip>
      <v-subheader
        class="pl-8"
        style="
          font-size: 0.8125rem;
          font-weight: 500;
          line-height: 1rem;
          color: #fff;
        "
      >
        {{ output ? 'Output Data' : 'Input Data' }}
      </v-subheader>
      <v-spacer />
      <v-menu offset-y>
        <!-- FIXME: visual glitch: on mobile this v-menu opens half a page higher than where it's supposed to -->
        <template v-slot:activator="{ on }">
          <v-btn dark text small v-on="on">
            <h4>{{ viewType }}</h4>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-if="!!inputData" @click="viewType = 'Method view'">
            Method view
          </v-list-item>
          <v-list-item @click="viewType = 'Raw view'">Raw view</v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-text>
      <template v-if="viewType === 'Method view'">
        <pre>
Function: {{ inputData.function }}

MethodID: {{ inputData.methodId }}
<span v-for="(item, index) in inputData.params" :key="index">[{{ index }}]:  {{ item }}
</span>
</pre>
      </template>
      <template v-if="viewType === 'Raw view'">
        <p>{{ inputString }}</p>
      </template>
    </v-card-text>
  </v-card>
</template>

<script>
import contracts from '~/scripts/contracts'

export default {
  props: {
    inputString: {
      type: String,
      required: true,
      default: () => {},
    },
    output: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  data() {
    return {
      viewType: 'Raw view',
      inputData: null,
    }
  },
  watch: {
    inputString(val) {
      this.inputData = contracts.processTxnInput(val)
      if (this.inputData.isKnown) {
        this.viewType = 'Method view'
      } else {
        this.viewType = 'Raw view'
      }
    },
  },
  created() {
    this.inputData = contracts.processTxnInput(this.inputString)
    if (this.inputData.isKnown) {
      this.viewType = 'Method view'
    }
  },
}
</script>
