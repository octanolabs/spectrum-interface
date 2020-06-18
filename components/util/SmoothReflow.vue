<template>
  <component :is="tag">
    <slot />
  </component>
</template>

<script>
import smoothReflow from 'vue-smooth-reflow'
export default {
  name: 'SmoothReflow',
  mixins: [smoothReflow],
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    options: {
      type: Object,
      required: false,
      default: () => {},
    },
  },
  mounted() {
    this.$smoothReflow(this.options)
  },
}
</script>
