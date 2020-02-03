<template>
  <v-footer class="footer" app>
    <v-card color="transparent" width="100%">
      <v-card-text>
        <v-row>
          <v-col cols="6"
            ><div style="display:inline-block;width:280px;">
              <img
                src="../assets/poweredby.png"
                style="height:50px;margin:0 auto 5px auto;"
              />
              Ubiqscan is powered by Ubiq Spectrum an open-source block explorer
              and analytics platform for Ubiq, a decentralized smart contracts
              platform.
            </div></v-col
          >
          <v-col cols="3"
            ><h6>Latest Discussions <span class="fa fa-reddit" /></h6>
            <hr style="margin: 5px 0px"/>
            <div v-for="(item, index) in reddit" :key="index">
              <a
                v-if="item.data.title.length < 90"
                :href="'https://reddit.com' + item.data.permalink"
                target="_blank"
                >{{ item.data.title }}</a
              >
              <a
                v-else
                :href="'https://reddit.com' + item.data.permalink"
                target="_blank"
                >{{ item.data.title.substr(0, 90) }}...</a
              >
              <hr style="margin: 5px 0px" /></div
          ></v-col>
          <v-col cols="3"
            ><h6>Social <span class="fa fa-users" /></h6>
            <hr style="margin: 5px 0px" />
            <ul class="social">
              <li>
                <a href="https://twitter.com/ubiqsmart.com" target="_blank"
                  ><span class="fa fa-twitter" /> Twitter</a
                >
              </li>
              <li>
                <a href="https://discord.gg/HF6vEGF" target="_blank"
                  ><span class="fa fa-users" /> Discord</a
                >
              </li>
              <li>
                <a href="https://github.com/ubiq/" target="_blank"
                  ><span class="fa fa-github-alt" /> Github</a
                >
              </li>
              <li>
                <a href="https://www.reddit.com/r/Ubiq/" target="_blank"
                  ><span class="fa fa-reddit" /> Reddit</a
                >
              </li>
              <li>
                <a href="https://blog.ubiqsmart.com" target="_blank"
                  ><span class="fa fa-medium" /> Blog</a
                >
              </li>
            </ul></v-col
          >
        </v-row>
      </v-card-text>
      <v-spacer></v-spacer>
      <v-card-text>
        <v-row justify="space-around">
          <a href="https://ubiqsmart.com" target="_blank">
            Ubiqsmart © 2018 (C)
          </a>
          <nuxt-link
            :to="{
              name: 'Address',
              params: { hash: '0xa126d20e4424ff3f611670c129b931ad3eb60433' }
            }"
            >Donations 0xa126d20e4424ff3f611670c129b931ad3eb60433</nuxt-link
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Footer',
  data() {
    return {
      reddit: []
    }
  },
  created() {
    this.fetch()
  },
  methods: {
    fetch() {
      axios
        .get('https://reddit.com/r/Ubiq/new.json?sort=new')
        .then((response) => {
          // eslint-disable-next-line no-console
          console.log(response)
          this.reddit = response.data.children.splice(0, 4)
        })
    }
  }
}
</script>

<style scoped>
.footer-grid {
  display: grid;
  grid-template-rows: 0.1fr 30px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    'ubiq reddit social'
    'copy copy copy';
}
.ubiq {
  grid-area: ubiq;
}
.reddit {
  grid-area: reddit;
}
.social {
  grid-area: social;
}
.copy {
  grid-area: copy;
  /*display: flex;*/
  /*justify-content: space-between;*/
}
.v-card__text {
  padding: 0;
}
.col {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
