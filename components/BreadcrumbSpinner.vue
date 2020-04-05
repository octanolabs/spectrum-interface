<template>
  <v-row style="margin: 0">
    <v-col cols="10">
      <v-breadcrumbs>
        <v-breadcrumbs-item
          ><nuxt-link to="/">Home</nuxt-link></v-breadcrumbs-item
        >
        <template v-for="(item, idx) in pathItems">
          <div :key="idx">
            <v-breadcrumbs-item>/</v-breadcrumbs-item>
            <v-breadcrumbs-item active>{{ item }}</v-breadcrumbs-item>
          </div>
        </template>
      </v-breadcrumbs>
    </v-col>
    <v-spacer></v-spacer>
    <v-col cols="2" class="d-flex justify-end align-center">
      <v-btn
        :disabled="loading"
        :loading="loading"
        text
        icon
        @click="$emit('refresh')"
      >
        <!--        <v-icon>mdi-atom-variant</v-icon>-->
        <v-icon>mdi-rotate-right</v-icon>
        <template v-slot:loader>
          <span class="custom-loader">
            <!--            Make custom loader component with mdi-circle-outline-1 thru mdi-circle-outline-8-->
            <v-icon light>mdi-rotate-right</v-icon>
          </span>
        </template>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    // load: {
    //   type: Boolean,
    //   default: () => {
    //     return false
    //   }
    // },
    loading: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  computed: {
    pathItems() {
      const path = this.$route.fullPath
      const pathItems = []

      path.split('/').forEach((v) => {
        pathItems.push(v.charAt(0).toUpperCase() + v.slice(1))
      })

      pathItems.shift()

      return pathItems
    }
  }
}
</script>

<style scoped>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
