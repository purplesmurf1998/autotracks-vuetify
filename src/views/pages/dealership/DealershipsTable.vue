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
            v-if="item._id == activeDealershipId"
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
        <template v-slot:[`item.creation_time`]="{ item }">
          {{ getDateString(item.creation_time) }}
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
import DealershipService from "../../../services/dealershipService";
import { mapGetters } from "vuex";

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
        value: "creation_time",
      },
    ],
  }),
  computed: {
    ...mapGetters(["accountId", "activeDealershipId"]),
    dealershipAlreadyActive() {
      if (!this.selectedDealership) return false;

      return this.selectedDealership._id == this.activeDealershipId;
    },
  },
  methods: {
    getDateString(time) {
      const date = new Date(time);
      return date.toISOString().split("T")[0];
    },
    confirmSelect() {
      DealershipService.activateDealership(
        this.accountId,
        this.selectedDealership._id
      )
        .then(() => {
          this.$router.go();
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    selectDealership(dealership) {
      this.selectedDealership = dealership;
      this.confirmSelectedDealership = true;
    },
    fetchDealerships() {
      DealershipService.getDealerships(this.accountId)
        .then((response) => {
          console.log(response);
          this.dealerships = response.data;
          this.$emit("set-count", this.dealerships.length);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchDealerships();
  },
};
</script>

<style scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
</style>
