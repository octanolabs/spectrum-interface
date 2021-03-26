<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          x-small
          color="primary"
          v-bind="attrs"
          :disabled="balances.length === 0"
          v-on="on"
        >
          {{ balances.length }}
        </v-btn>
      </template>
      <v-card>
        <v-toolbar dark color="primary">
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Token Balances</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line subheader>
          <v-subheader>ERC20 Tokens</v-subheader>
          <v-list-item
            v-for="(token, index) of balances"
            :key="index"
            style="border-bottom: 1px solid #272727"
          >
            <v-list-item-avatar size="24">
              <v-img
                :src="
                  'https://raw.githubusercontent.com/octanolabs/assets/master/blockchains/ubiq/assets/' +
                  token.address +
                  '/logo.png'
                "
              >
                <template v-slot:placeholder>
                  <blockie :address="token.address" size="sm" inline />
                </template>
              </v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ token.name }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ token.address }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text>
                {{ nf.format(token.balance) }} {{ token.symbol }}
              </v-list-item-action-text>
              <v-list-item-action-text>
                ${{ token.value }}
              </v-list-item-action-text>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import Blockie from '~/components/util/misc/Blockie'

export default {
  components: {
    Blockie,
  },
  props: {
    account: {
      type: String,
      required: true,
    },
    balances: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      nf: new Intl.NumberFormat('en', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 18,
      }),
    }
  },
}
</script>
