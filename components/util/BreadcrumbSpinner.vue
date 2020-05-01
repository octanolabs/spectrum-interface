<template>
  <v-row style="margin: 0">
    <v-col cols="11">
      <v-breadcrumbs
        v-if="!noBreadcrumbs"
        :items="[{ text: 'Home', to: '/' }, ...pathItems]"
      ></v-breadcrumbs>
    </v-col>
    <v-spacer></v-spacer>
    <v-col v-if="!noLoading" cols="1" class="d-flex justify-end align-center">
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
import addresses from '../../scripts/addresses'

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    noLoading: {
      type: Boolean,
      default: false
    },
    noBreadcrumbs: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    pathItems() {
      const route = this.$route
      const pathItems = []

      const split = route.fullPath
        .split('/')
        .filter((item) => !item.includes('?'))

      // .forEach((v) => {
      //   pathItems.push(v.charAt(0).toUpperCase() + v.slice(1))
      // })

      for (const [index, item] of split.entries()) {
        if (index > 0) {
          const pathItem = {
            text: item.charAt(0).toUpperCase() + item.slice(1),
            to: split.slice(0, index + 1).join('/')
          }

          pathItems.push(pathItem)
        }
      }

      if (route.name === 'account-address') {
        const addressName = addresses.getAddressTag(route.params.address)
        if (addressName !== null) {
          pathItems[pathItems.length - 1].text =
            pathItems[pathItems.length - 1].text + ` (${addressName})`
        }
      }

      // const items = pathItems.map((item) => {
      //   return { text: item.charAt(0).toUpperCase() + item.slice(1), to: '' }
      // })

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
