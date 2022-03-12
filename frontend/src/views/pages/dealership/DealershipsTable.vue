<template>
  <div>
    <v-card width="90%" class="mx-auto mt-5">
      <v-data-table
        :headers="headers"
        :items="dealerships"
        :items-per-page="10"
        @click:row="selectDealership"
        class="row-pointer"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            v-if="item._id == $store.state.dealership._id"
            color="success"
          >
            mdi-check-circle-outline
          </v-icon>
        </template>
        <template v-slot:[`item.formatted_address`]="{ item }">
          {{ item.geocoded_address.streetNumber }}
          {{ item.geocoded_address.streetName }},
          {{ item.geocoded_address.city }}
        </template>
        <template v-slot:[`item.created_at`]="{ item }">
          {{ item.created_at.toString().substring(0, 10) }}
        </template>
      </v-data-table>
    </v-card>
    <v-dialog
      transition="dialog-bottom-transition"
      width="500"
      v-model="confirmSelectedDealership"
    >
      <v-card>
        <v-card-title class="text-h6"> Activating a Dealership </v-card-title>
        <v-card-text class="black--text" v-if="!dealershipAlreadyActive">
          Continuing this action will activate the selected dealership. The rest
          of the system will reflect this change. Continue?
        </v-card-text>
        <v-card-text class="black--text" v-if="dealershipAlreadyActive">
          This dealership is already activated. Please select a different
          dealership to activate.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            @click="confirmSelect"
            v-if="!dealershipAlreadyActive"
          >
            Activate
          </v-btn>
          <v-btn
            color="secondary"
            text
            @click="confirmSelectedDealership = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DealershipsTable",

  data: () => ({
    dealerships: [],
    selectedDealership: null,
    confirmSelectedDealership: false,
    headers: [
      {
        text: "Active",
        value: "actions",
        sortable: false,
      },
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Address",
        value: "formatted_address",
      },
      {
        text: "Date Created",
        value: "created_at",
      },
    ],
  }),
  computed: {
    dealershipAlreadyActive() {
      if (!this.selectedDealership) return false;

      return this.selectedDealership._id == this.$store.state.dealership._id;
    },
  },
  methods: {
    confirmSelect() {
      axios
        .put(
          `${this.$store.state.baseApiUrl}/users/${this.$store.state.loggedInUser._id}`,
          {
            dealership: this.selectedDealership._id,
          }
        )
        .then(() => {
          this.$router.go();
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    selectDealership(dealership) {
      this.selectedDealership = dealership;
      this.confirmSelectedDealership = true;
    },
    fetchDealerships() {
      axios
        .get(`${this.$store.state.baseApiUrl}/dealerships`, {
          params: {
            owner: this.$store.state.loggedInUser._id,
          },
        })
        .then((response) => {
          this.dealerships = response.data.payload;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    if (!this.$store.state.loggedInUser.owner) {
      // show error
    } else {
      this.fetchDealerships();
    }
  },
};
</script>

<style scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>