<template>
  <perfect-scrollbar style="height: 100%">
    <v-app>
      <AppBar />
      <!--<notifications
            position="top left"
            class="top-notification"
            group="normal"
            width="100%"
           />-->

      <!-- Sizes your content based upon application components -->
      <!-- AppBar's smooth reflow doesn't play nice with nuxt's auto resizing shenanigans, this padding makes it so the content under the appbar is not moved-->
      <v-content style="padding-top: 112px;">
        <!-- Provides the application the proper gutter -->
        <v-container fluid>
          <nuxt></nuxt>
        </v-container>
      </v-content>

      <!--    remove footer for dev-->
      <Footer />
    </v-app>
  </perfect-scrollbar>
</template>

<script>
// import common from '../scripts/common'
// import axios from 'axios'
// import addresses from '../scripts/addresses'
import AppBar from '../components/AppBar'
import Footer from '../components/Footer'

export default {
  components: {
    AppBar,
    Footer
  }
}
</script>

<style></style>
