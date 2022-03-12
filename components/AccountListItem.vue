<template>
  <v-list
    :three-line="!!addressBook && showPersona && showAddressBookName && !basic"
    style="width: 100%; background-color: rgba(0, 0, 0, 0)"
    class="pa-0"
  >
    <v-list-item>
      <template v-if="showIdenticon">
        <v-list-item-avatar
          v-if="fetchIcon"
          style="cursor: pointer"
          class="my-auto"
          tile
        >
          <v-img
            :src="
              'https://raw.githubusercontent.com/octanolabs/assets/master/blockchains/ubiq/assets/' +
              formatAddress(address, true) +
              '/logo.png'
            "
          >
            <template v-slot:placeholder>
              <blockie :address="address" size="fourty" inline />
            </template>
          </v-img>
          <!-- <blockie :address="address" size="md" inline /> -->
        </v-list-item-avatar>
        <v-list-item-avatar v-else style="cursor: pointer" class="my-auto" tile>
          <blockie :address="address" size="fourty" inline />
        </v-list-item-avatar>
      </template>
      <v-list-item-content>
        <v-list-item-title v-if="!!addressBook && showAddressBookName">
          {{ addressBook }}
        </v-list-item-title>
        <v-list-item-title v-else-if="showPersona && !!persona">
          {{ persona.name.given }} {{ persona.name.family }}
          <v-tooltip v-if="!basic" top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" small v-on="on">{{ sexIcon }}</v-icon>
            </template>
            <span>{{ $t('persona.' + persona.sex) }}</span>
          </v-tooltip>
          <v-tooltip v-if="!basic" top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" small v-on="on">{{ zodiacIcon }}</v-icon>
            </template>
            <span>{{ $t('persona.' + persona.zodiac) }}</span>
          </v-tooltip>
        </v-list-item-title>
        <v-list-item-subtitle
          v-if="showPersona && !!addressBook && showAddressBookName && !basic"
        >
          {{ persona.name.given }} {{ persona.name.family }}
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" small v-on="on">{{ sexIcon }}</v-icon>
            </template>
            <span>{{ $t('persona.' + persona.sex) }}</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" small v-on="on">{{ zodiacIcon }}</v-icon>
            </template>
            <span>{{ $t('persona.' + persona.zodiac) }}</span>
          </v-tooltip>
        </v-list-item-subtitle>
        <v-list-item-subtitle v-if="link">
          <nuxt-link :to="'/address/' + address.toLowerCase()">
            {{ formatAddress(address, checksumedAddress) }}
          </nuxt-link>
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          {{ formatAddress(address, checksumedAddress) }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <slot></slot>
    </v-list-item>
  </v-list>
</template>

<script>
import { ethers } from 'ethers'
import { getPersona } from '@octano/persona'
import Blockie from './identicons/Blockie.vue'

export default {
  name: 'AccountListItem',
  components: {
    Blockie,
  },
  props: {
    address: {
      type: String,
      default() {
        return null
      },
    },
    name: {
      type: String,
      default() {
        return null
      },
    },
    link: {
      type: Boolean,
      default() {
        return false
      },
    },
    fetchIcon: {
      type: Boolean,
      default() {
        return true
      },
    },
    basic: {
      type: Boolean,
      default() {
        return false
      },
    },
  },
  data() {
    return {
      identicon: 0,
      sexIcon: 'mdi-gender-male',
      zodiacIcon: 'mdi-zodiac-aquarius',
      moonIcon: 'mdi-moon-new',
      addressBook: null,
      persona: null,
    }
  },
  computed: {
    showIdenticon() {
      return true
    },
    showAddressBookName() {
      return true
    },
    showPersona() {
      return true
    },
    checksumedAddress() {
      return true
    },
    defaultIdenticon() {
      return 0
    },
  },
  watch: {
    defaultIdenticon(newVal, oldVal) {
      if (newVal !== oldVal && newVal !== this.identicon) {
        this.identicon = newVal
      }
    },
    address(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (/^0x[0-9a-fA-F]{40}$/i.test(newVal)) {
          this.persona = getPersona(this.address)
          this.sexIcon = `mdi-gender-${this.persona.sex}`
          this.zodiacIcon = `mdi-zodiac-${this.persona.zodiac}`
          this.moonIcon = `mdi-moon-${this.persona.moon}`
        }
      }
    },
    name(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.addressBook = newVal
      }
    },
  },
  created() {
    this.identicon = this.defaultIdenticon
    if (this.address) {
      this.persona = getPersona(this.address)
      this.sexIcon = `mdi-gender-${this.persona.sex}`
      this.zodiacIcon = `mdi-zodiac-${this.persona.zodiac}`
      this.moonIcon = `mdi-moon-${this.persona.moon}`
    }
    if (this.name) {
      this.addressBook = this.name
    }
  },
  methods: {
    formatAddress(address, bool) {
      // return multi-case checksum address or lowercase
      if (/^0x[0-9a-fA-F]{40}$/i.test(address)) {
        return bool
          ? ethers.utils.getAddress(address.toLowerCase())
          : address.toLowerCase()
      } else {
        return address
      }
    },
  },
}
</script>
