<template>
  <v-row>
    <b-col md="12">
      <nav style="margin-right:-4px;">
        <b-pagination
          :total-rows="getRowCount(items)"
          :per-page="perPage"
          v-model="currentPage"
          size="md"
          align="right"
          prev-text="Prev"
          next-text="Next"
        />
      </nav>
      <b-card no-body>
        <b-table
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          class="mb-0"
          responsive="sm"
          hover
          stacked="sm"
        >
          <div slot="address" slot-scope="data">
            <nuxt-link :to="{ name: 'Token', params: { hash: data.value } }"
              >{{ data.value.substr(0, 17) }}...</nuxt-link
            >
          </div>
        </b-table>
      </b-card>
      <nav style="margin-right:-4px;margin-top:15px;">
        <b-pagination
          :total-rows="getRowCount(items)"
          :per-page="perPage"
          v-model="currentPage"
          size="md"
          align="right"
          prev-text="Prev"
          next-text="Next"
        />
      </nav>
    </b-col>
  </v-row>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    }
  },
  data: () => {
    return {
      currentPage: 1,
      perPage: 25,
      totalRows: 0,
      fields: {
        symbol: {
          label: 'Symbol'
        },
        name: {
          label: 'Name'
        },
        decimals: {
          label: 'Decimals'
        },
        address: {
          label: 'Address'
        }
      }
    }
  },
  methods: {
    getRowCount(items) {
      return items.length
    }
  }
}
</script>
