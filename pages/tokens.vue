<template>
  <v-row justify="center">
    <v-col cols="10">
      <expansion-table :items="items" :headers="headers">
        <template v-slot:expansion="item">
          hello, i am an expansion panel, and this is my item {{ item }}
        </template>
      </expansion-table>
    </v-col>
  </v-row>
</template>

<script>
import ExpansionTable from '~/components/util/ExpansionTable'

export default {
  components: {
    ExpansionTable
  },
  data() {
    return {
      items: [
        {
          test1: '1',
          test2: '2',
          test3: '3'
        },
        {
          test1: '12',
          test2: '23',
          test3: '34'
        },
        {
          test1: '1',
          test2: '2',
          test3: '3'
        },
        {
          test1: '12',
          test2: '23',
          test3: '34'
        },
        {
          test1: '1',
          test2: '2',
          test3: '3'
        },
        {
          test1: '12',
          test2: '23',
          test3: '34'
        },
        {
          test1: '1',
          test2: '2',
          test3: '3'
        },
        {
          test1: '12',
          test2: '23',
          test3: '34'
        },
        {
          test1: '1',
          test2: '2',
          test3: '3'
        },
        {
          test1: '12',
          test2: '23',
          test3: '34'
        },
        {
          test1: '1',
          test2: '2',
          test3: '3'
        },
        {
          test1: '12',
          test2: '23',
          test3: '34'
        }
      ],
      headers: [
        {
          value: 'test1',
          text: 'first',
          sortable: false
        },
        {
          value: 'test2',
          text: 'second',
          sortable: false
        },
        {
          value: 'test3',
          text: 'third',
          sortable: false
        }
      ]
    }
  }
}
</script>
