<template>
  <div>
    <v-card flat v-if="dealership">
      <v-card-title class="text-h3 font-weight-light">{{
        dealership.name
      }}</v-card-title>
      <v-card-text>
        <p class="text-h6 black--text font-weight-light mt-3">
          {{ dealership.geocoded_address.streetNumber }}
          {{ dealership.geocoded_address.streetName }}
        </p>
        <p class="text-h6 black--text font-weight-light">
          {{ dealership.geocoded_address.city }},
          {{ dealership.geocoded_address.country }}
        </p>
        <p class="text-h6 black--text font-weight-light">
          {{ dealership.geocoded_address.zipcode }}
        </p>
      </v-card-text>
      <v-card-actions>
        <!-- <v-btn color="primary">
          <v-icon class="mr-2">mdi-pencil</v-icon>
          Edit Details
        </v-btn>
        <v-btn color="warning" @click="resetDialog = true">
          <v-icon class="mr-2">mdi-alert-circle</v-icon>
          Reset Dealership
        </v-btn>
        <v-btn color="error" @click="deleteDialog = true">
          <v-icon class="mr-2">mdi-delete</v-icon>
          Delete Dealership
        </v-btn> -->
      </v-card-actions>
    </v-card>
    <v-card flat v-else>
      <v-card-title class="text-h3 font-weight-light"
        >No Active Dealership</v-card-title
      >
      <v-card-text>
        <p class="text-h6 black--text font-weight-light mt-3">
          You currently have no active dealership selected. If you've already
          created a dealership, you can activate it by visiting the
          <b>List</b> tab above and selecting it. If not, you can create a
          dealership by pressing the <b>Create New Dealership</b> button on the
          top right of this page.
        </p>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-card>
    <!-- <v-dialog 
      v-model="deleteDialog"
      transition="dialog-bottom-transition"
      width="500"
    >
      <delete-dialog 
        v-if="dealershipCount > 1"
        dialogContent="Are you sure you want to delete this dealership? Doing so will delete everything related to it except for your account. Press 'Delete' to confirm." 
        @cancel="deleteDialog = false"
        @confirm="deleteDealership"
      />
      <v-card v-else>
        <v-card-title class="text-h6"> Action Refused </v-card-title>
        <v-card-text class="black--text">
          This dealership cannot be deleted as it is your only one and you must have at least one dealership active. You can 'reset' the dealership using the <strong>Reset Dealership</strong> option instead.
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="deleteDialog = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog 
      v-model="resetDialog"
      transition="dialog-bottom-transition"
      width="500"
    >
      <reset-dialog 
        v-if="resetDialog" 
        dialogContent="Are you sure you want to reset this dealership? Doing so will delete everything related to it except for your account and the dealership. Press 'Reset' to confirm." 
        @cancel="resetDialog = false"
        @confirm="resetDealership"
      />
    </v-dialog> -->
  </div>
</template>

<script>
// import DeleteDialog from "@/components/DeleteDialog.vue";
// import ResetDialog from "@/components/ResetDialog.vue";
import DealershipService from "../../../services/dealershipService";
import { mapGetters } from "vuex";

export default {
  name: "DealershipDetails",

  data: () => ({
    dealership: null,
    dealershipCount: 0,
    deleteDialog: false,
    resetDialog: false,
  }),
  computed: {
    ...mapGetters(["activeDealershipId", "accountId"]),
  },
  methods: {
    fetchDealership() {
      DealershipService.getDealership(this.accountId, this.activeDealershipId)
        .then((response) => {
          this.dealership = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchDealershipCount() {
      DealershipService.getDealerships(this.accountId)
        .then((response) => {
          this.dealershipCount = response.data.length;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  components: {
    // DeleteDialog,
    // ResetDialog
  },
  mounted() {
    if (this.activeDealershipId) {
      this.fetchDealership();
      this.fetchDealershipCount();
    }
  },
};
</script>

<style></style>
