<template>
  <v-col cols="12" class="pa-0">
    <breadcrumb-spinner no-loading />
    <v-list>
      <v-list-item dense>
        <v-list-item-content class="py-0">
          <v-list-item-title>Persona</v-list-item-title>
          <v-list-item-subtitle>
            A javascript module that brings addresses to life
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <small class="px-4">
      <p class="pl-4">
        Octano Persona is a Javascript module that provides a simple,
        human-friendly identity for Ubiq addresses. It is used throughout
        ubiqscan allowing users to quickly understand complex interactions
        involving multiple accounts.
      </p>
    </small>
    <v-subheader>Install</v-subheader>
    <v-card class="ma-1 code-card" outlined>
      <v-card-actions>
        <v-subheader>NPM</v-subheader>
        <v-spacer />
        <copy-to-clipboard
          :copy="npm"
          type="icon"
          tooltip="left"
          color="primary"
        />
      </v-card-actions>
      <v-divider />
      <v-card-text class="pa-0">
        <pre
          v-highlightjs="npm"
        ><code class="javascript w-100 elevation-0" /></pre>
      </v-card-text>
    </v-card>
    <v-card class="ma-1 code-card" outlined>
      <v-card-actions>
        <v-subheader>Yarn</v-subheader>
        <v-spacer />
        <copy-to-clipboard
          :copy="yarn"
          type="icon"
          tooltip="left"
          color="primary"
        />
      </v-card-actions>
      <v-divider />
      <v-card-text class="pa-0">
        <pre
          v-highlightjs="yarn"
        ><code class="javascript w-100 elevation-0" /></pre>
      </v-card-text>
    </v-card>
    <v-subheader>Usage</v-subheader>
    <v-card class="ma-1 code-card" outlined>
      <v-card-actions>
        <v-subheader>getPersona</v-subheader>
        <v-spacer />
        <copy-to-clipboard
          :copy="getPersona"
          type="icon"
          tooltip="left"
          color="primary"
        />
      </v-card-actions>
      <v-divider />
      <v-card-text class="pa-0">
        <pre
          v-highlightjs="getPersona"
        ><code class="javascript w-100 elevation-0"></code></pre>
        <v-divider />
        <pre
          v-highlightjs="persona"
        ><code class="javascript w-100 elevation-0"></code></pre>
      </v-card-text>
    </v-card>
    <v-card class="ma-1 code-card" outlined>
      <account-list-item
        address="0x0000000000000000000000000000000000000000"
        link
      />
    </v-card>
  </v-col>
</template>

<script>
import stringifyObject from 'stringify-object'
import breadcrumbSpinner from '~/components/util/BreadcrumbSpinner.vue'
import CopyToClipboard from '~/components/apis/copy2clipboard'
import AccountListItem from '~/components/AccountListItem.vue'

export default {
  components: {
    breadcrumbSpinner,
    CopyToClipboard,
    AccountListItem,
  },
  data() {
    return {
      npm: 'npm install @octano/persona',
      yarn: 'yarn add @octano/persona',
      getPersona:
        "import { getPersona } from '@octano/persona'\n" +
        "const persona = getPersona('0x0000000000000000000000000000000000000000')\n" +
        'console.log(persona)',
      persona: stringifyObject({
        success: true,
        sex: 'male',
        name: {
          given: 'Eitaro',
          family: 'Kishimoto',
        },
        zodiac: 'aries',
        version: 1,
      }),
    }
  },
}
</script>
