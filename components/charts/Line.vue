<template>
  <!-- The vue wrapper lib adds a default aspect ratio (ct-square) that fuckd up stuff, keep as empty string -->
  <chartist :data="chartData" type="Line" ratio="ct-major-twelfth" />
</template>

<script>
export default {
  props: {
    chartData: {
      type: Object,
      default: () => {
        return { series: [1, 2, 3], labels: ['One', 'Two', 'Three'] }
      }
    },
    options: {
      type: Object,
      default: () => {
        return { height: 'inherit', width: 'inherit' }
      }
    },
    maxHeight: {
      type: String,
      default: () => {
        return 'inherit'
      }
    }
  },
  computed: {
    style() {
      return { 'max-height': this.maxHeight }
    }
  }
}
</script>

<style>
.ct-series-a .ct-line {
  /* Set the colour of this series line */
  stroke: #00ea90;
  /* Control the thikness of your lines */
  stroke-width: 2.5px;
}

.ct-series-a .ct-point {
  /* Colour of your points */
  stroke: #00ea90;
  /* Size of your points */
  stroke-width: 7px;
  /* Make your points appear as squares */
  stroke-linecap: round;
}
</style>
