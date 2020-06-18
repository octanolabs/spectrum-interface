<template>
  <v-dialog max-width="300">
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">mdi-qrcode</v-icon>
    </template>
    <v-card>
      <v-card-text>
        <v-row justify="center" align="center">
          <qrcode
            tag="img"
            :value="address"
            :options="{
              color: { dark: '#00ea90', light: '#0000' },
              scale: 7,
            }"
          ></qrcode>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'QrcodeModal',
  props: {
    address: {
      type: String,
      required: true,
      default: '0x0000000000000000000000000000000000000000',
    },
  },
}
</script>
