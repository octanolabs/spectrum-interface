<template>
  <v-card flat color="#303030">
    <v-card-title>
      {{ 'Event Logs (' + eventLogs.length + ')' }}
    </v-card-title>
    <!-- leave this gross indentation for correct formatting inside pre -->
    <v-card-text class="body-2">
      <pre>
<strong>Transaction Receipt Event Logs</strong>
<p v-for="(item, index) in eventLogs" :key="index">
[{{index}}]  Address    {{ item.address }}
     <span v-if="item.isKnown">Name       {{ item.name }}</span>

     Topics<span v-for="(topic, tindex) in item.topics" :key="tindex">
                [{{ tindex }}] {{ topic }}</span>

     Data<span v-for="(data, dindex) in item.data" :key="dindex">
                {{ data }}</span>
</p>
            </pre>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    eventLogs: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
}
</script>
