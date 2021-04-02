<template>
  <v-dialog max-width="259">
    <template v-slot:activator="{ on }">
      <v-icon v-on="on">mdi-qrcode</v-icon>
    </template>
    <v-card color="#fff">
      <v-card-text class="pa-0">
        <v-row justify="center" align="center" no-gutters>
          <qrcode
            tag="img"
            :value="address"
            :options="{
              color: { dark: '#000000', light: '#0000' },
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
