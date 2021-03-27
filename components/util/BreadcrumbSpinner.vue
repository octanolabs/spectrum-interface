<template>
  <v-app-bar
    flat
    height="26px"
    style="background-color: #1e1e1e; border-bottom: 1px solid #2e2e2e"
    class="pa-0"
  >
    <v-breadcrumbs
      v-if="!noBreadcrumbs"
      :items="[{ text: 'Home', to: '/' }, ...pathItems]"
      class="pa-0"
      divider=">"
    ></v-breadcrumbs>
    <v-spacer></v-spacer>
    <v-btn
      v-if="!noLoading"
      :disabled="loading"
      :loading="loading"
      tile
      small
      icon
      @click="$emit('refresh')"
    >
      <!--        <v-icon>mdi-atom-variant</v-icon>-->
      <v-icon small>mdi-rotate-right</v-icon>
      <template v-slot:loader>
        <span class="custom-loader">
          <!--            Make custom loader component with mdi-circle-outline-1 thru mdi-circle-outline-8-->
          <v-icon light small>mdi-rotate-right</v-icon>
        </span>
      </template>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    noLoading: {
      type: Boolean,
      default: false,
    },
    noBreadcrumbs: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    pathItems() {
      const route = this.$route
      const pathItems = []
      const split = route.fullPath
        .split('/')
        .filter((item) => !item.includes('?'))
      for (const [index, item] of split.entries()) {
        if (index > 0) {
          let text = item
          let path = split[1]

          if (route.name === 'block-id') {
            if (item === 'block') {
              text = 'blocks'
              path = '/blocks'
            } else {
              pathItems.push({
                text: item.substr(0, 12),
              })
              break
            }
          }
          if (route.name === 'tx-hash') {
            if (item === 'tx') {
              text = 'transactions'
              path = '/transactions'
            } else {
              pathItems.push({
                text: item.substr(0, 12),
              })
              break
            }
          }
          if (route.name === 'tokenTransfers') {
            if (item === 'tokentransfers') {
              pathItems.push({
                text: 'Token Transfers',
                to: 'tokentransfers',
              })
              break
            }
          }
          if (route.name === 'uncle-hash') {
            if (item === 'uncle') {
              text = 'uncles'
              path = '/uncles'
            } else {
              pathItems.push({
                text: item.substr(0, 12),
              })
              break
            }
          }
          // path = split.slice(0, index + 1).join('/')
          if (route.name === 'transactions' && item === 'transactions') {
            if (split[index + 1] && split[index + 1] !== 'latest') {
              path = split.slice(0, index).join('/') + 'latest'
            } else {
              pathItems.push({
                text: item.charAt(0).toUpperCase() + item.slice(1),
                to: split.slice(0, index + 1).join('/'),
              })
              break
            }
          }
          if (route.name === 'uncles' && item === 'uncles') {
            pathItems.push({
              text: 'Blocks',
              to: 'blocks',
            })
          }
          if (route.name === 'forkedBlocks' && item === 'forkedBlocks') {
            pathItems.push({
              text: 'Blocks',
              to: 'blocks',
            })
            pathItems.push({
              text: 'Forked',
              to: split.slice(0, index + 1).join('/'),
            })
            break
          }
          if (route.name === 'address-account') {
            if (item === 'address') {
              text = 'Accounts'
              path = ''
            } else {
              pathItems.push({
                text: item.substr(0, 12),
              })
              break
            }
          }
          const pathItem = {
            text: text.charAt(0).toUpperCase() + text.slice(1),
            to: path,
          }

          pathItems.push(pathItem)
        }
      }

      return pathItems
    },
  },
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
