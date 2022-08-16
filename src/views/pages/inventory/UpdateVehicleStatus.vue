<template>
  <v-card>
    <v-card-title> Update Vehicle Status </v-card-title>
    <v-card-text>
      <v-form lazy-validation>
        <div>
          <v-select
            outlined
            dense
            :items="availableStatus"
            :placeholder="vehicle.status"
            label="Vehicle Status"
            v-model="vehicleStatus"
          />
        </div>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="save"> Save Changes </v-btn>
      <v-btn color="secondary" text @click="cancel"> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import InventoryService from "../../../services/inventoryService";
import { mapGetters } from "vuex";

export default {
  name: "EditVehicle",
  props: {
    vehicle: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    vehicleStatus: null,
    availableStatus: [
      "IN_STOCK",
      "ALERT",
      "SOLD",
      "PREPPING",
      "IN_REPAIR",
      "IN_DELIVERY",
      "DELIVERED",
    ],
  }),
  computed: {
    ...mapGetters(["activeDealershipId"]),
  },
  methods: {
    save() {
      let vehicleObj = this.vehicle;
      vehicleObj.status = this.vehicleStatus;
      InventoryService.updateVehicle(
        this.activeDealershipId,
        this.vehicle._id,
        vehicleObj
      )
        .then((response) => {
          this.$emit("vehicle-updated", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("cancel");
    },
  },

  mounted() {
    // prevent from two-binding with the parent component
    this.vehicleStatus = this.vehicle.status;
  },
};
</script>
