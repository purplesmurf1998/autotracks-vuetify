<template>
  <div>
    <v-card>
      <v-card-title class="text-h6">
        Vehicle Details
        <v-spacer />
        <v-menu bottom left offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">
              <v-icon>mdi-menu</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item small>
              <v-list-item-title class="font-weight-regular"
                >View location on map</v-list-item-title
              >
            </v-list-item>
            <v-list-item small @click="deletingVehicle = true">
              <v-list-item-title class="error--text font-weight-regular"
                >Delete vehicle</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-text class="pt-3">
        This is the vehicle details dialog
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="clearSelectedVehicle">
          Close
        </v-btn>
      </v-card-actions>
      <v-dialog
        transition="dialog-bottom-transition"
        width="500"
        v-model="deletingVehicle"
      >
        <delete-dialog
          dialogContent="Are you certain you want to delete this vehicle from the inventory?"
          v-on:confirm="confirmDeleteVehicle"
          v-on:cancel="deletingVehicle = false"
        ></delete-dialog>
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import DeleteDialog from "../../../components/DeleteDialog.vue";

export default {
  name: "VehicleDetails",
  props: {
    vehicleId: {
      type: String,
      required: true,
    },
    clearSelectedVehicle: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    deletingVehicle: false,
  }),
  methods: {
    confirmDeleteVehicle() {
      axios
        .delete(`${this.$store.state.baseApiUrl}/vehicles/${this.vehicleId}`)
        .then(() => {
          this.$emit("vehicle-deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  components: {
    DeleteDialog,
  },
};
</script>

<style>
</style>