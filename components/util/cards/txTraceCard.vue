<template>
  <v-expansion-panels accordion>
    <v-expansion-panel
      v-for="(trace, idx) in traces"
      :key="depth * 10 + idx"
      style="filter: brightness(80%); background-color: #333333;"
    >
      <v-expansion-panel-header>{{ trace.type }}</v-expansion-panel-header>
      <v-expansion-panel-content>
        <pre style="white-space: pre-wrap;">
        <span>From      {{ trace.from }}</span>

        <span>To        {{ trace.to }}</span>

        <span>Value     {{ trace.value }}</span>

        <span>Gas       {{ trace.gas }}</span>

        <span>GasUsed   {{ trace.gasUsed }}</span>

        <span style="display: block;padding: 0px 70px;">Input
          {{ trace.input }}</span>
        <span style="display: block;padding: 0px 70px;">Ouput
          {{ trace.output }}</span>

</pre>
        <tx-trace-card
          v-if="trace.calls"
          :traces="trace.calls"
          :depth="depth + 1"
        />
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  components: {
    txTraceCard: () => import('./txTraceCard.vue'),
  },
  props: {
    traces: {
      type: Array,
      required: true,
      default: () => [],
    },
    depth: {
      type: Number,
      required: false,
      default: 1,
    },
  },
}
</script>
