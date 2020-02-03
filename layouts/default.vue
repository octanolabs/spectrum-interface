<template>
  <v-app>
    <AppBar />
    <!--<notifications
      position="top left"
      class="top-notification"
      group="normal"
      width="100%"
    />-->

    <!-- Sizes your content based upon application components -->
    <v-content>
      <!-- Provides the application the proper gutter -->
      <v-container fluid>
        <nuxt></nuxt>
      </v-container>
    </v-content>

    <Footer />
  </v-app>
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
