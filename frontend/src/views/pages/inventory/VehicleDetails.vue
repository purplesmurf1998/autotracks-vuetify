<template>
  <div>
    <v-card>
      <v-card-text class="pt-3">
        <v-row justify="center" v-if="loading" class="my-5">
          <v-progress-circular 
            indeterminate
            color="primary"     
          />
        </v-row>
        <!-- Details Row -->
        <v-card v-if="!loading" flat>
          <v-card-title>
            Details
            <v-spacer />
            <v-menu bottom left offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on">
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item small @click="updateVehicleStatusModal=true">
                  <v-list-item-icon class="mr-2">
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="font-weight-regular"
                    >Update Vehicle Status</v-list-item-title
                  >
                </v-list-item>
                <v-list-item small>
                  <v-list-item-icon class="mr-2">
                    <v-icon>mdi-alert-circle-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="font-weight-regular"
                    >Flag Vehicle</v-list-item-title
                  >
                </v-list-item>
                <v-list-item small @click="goToCreateSale">
                  <v-list-item-icon class="mr-2">
                    <v-icon>mdi-map-marker-check-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="font-weight-regular"
                    >Update Location</v-list-item-title
                  >
                </v-list-item>
                <v-divider class="my-2"/>
                <v-list-item small @click="showVehicleLocation" v-if="vehicle.location">
                  <v-list-item-icon class="mr-2">
                    <v-icon>mdi-map-marker-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="font-weight-regular"
                    >View location on map</v-list-item-title
                  >
                </v-list-item>
                <v-list-item small @click="deletingVehicle = true">
                  <v-list-item-icon class="mr-2">
                    <v-icon color="error">mdi-delete-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="error--text font-weight-regular"
                    >Delete vehicle</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row
              justify="space-between"
              align="center"
              class="ma-0 px-5"
            >
              <p class="text-lg-button mb-0">VIN</p>
              <p class="font-weight-light mb-0">{{ vehicle.vin }}</p>
            </v-row>
            <v-row
              justify="space-between"
              align="center"
              class="ma-0 px-5"
            >
              <p class="text-lg-button mb-0">Zone</p>
              <p class="font-weight-light mb-0" v-if="!vehicle.location || (vehicle.location && !vehicle.location.zone)">N/A</p>
            </v-row>
            <v-row
              justify="space-between"
              align="center"
              class="ma-0 px-5"
            >
              <p class="text-lg-button mb-0">Location</p>
              <p class="font-weight-light mb-0" v-if="!vehicle.location">N/A</p>
              <p class="font-weight-light mb-0" v-else>
                <a @click="showVehicleLocation">{{vehicle.location.lat}}, {{vehicle.location.lng}}</a>
              </p>
            </v-row>
            <v-row
              align="center"
              class="ma-0 px-5"
            >
              <p class="text-lg-button mb-0">On Road Since</p>
              <v-icon small class="ml-3" @click="editOnRoadSince">
                mdi-pencil
              </v-icon>
              <v-spacer />
              <p class="font-weight-light mb-0" v-if="!vehicle.on_road_since">N/A</p>
            </v-row>
            <v-row
              justify="space-between"
              align="center"
              class="ma-0 px-5"
            >
              <p class="text-lg-button mb-0">Date Added</p>
              <p class="font-weight-light mb-0">{{ vehicle.date_added.toString().substring(0, 10) }}</p>
            </v-row>
            <v-alert class="px-5 mb-0" color="accent" text dense outlined>
              <v-row class="ma-0" justify="space-between" align="center">
                <p class="text-lg-button mb-0">Status</p>
                <v-icon small class="ml-3" color="accent">
                  mdi-car-wrench
                </v-icon>
                <v-spacer />
                <p class="font-weight-light mb-0" v-if="!vehicle.on_road_since">{{vehicle.status}}</p>
              </v-row>
            </v-alert>
          </v-card-text>
        </v-card>
        <!-- Properties row -->
        <v-card v-if="!loading" flat>
          <v-card-title>
            Properties
            <v-spacer />
            <v-menu bottom left offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn text v-bind="attrs" v-on="on">
                  <v-icon>mdi-menu</v-icon>
                </v-btn>
              </template>

              <v-list dense>
                <v-list-item small @click="editingVehicle = true">
                  <v-list-item-icon class="mr-2">
                    <v-icon>mdi-pencil-outline</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title class="font-weight-regular"
                    >Edit vehicle properties</v-list-item-title
                  >
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row 
              v-for="(property, index) in Object.keys(vehicle.properties)" 
              :key="index" 
              justify="space-between"
              align="center"
              class="ma-0 px-5"
            >
              <p class="text-lg-button mb-0">{{ vehicle.properties[property].label }}</p>
              <p class="font-weight-light mb-0">{{ getFormattedValue(vehicle.properties[property]) }}</p>
            </v-row>
          </v-card-text>
          <v-alert
            :color="messageType"
            v-if="message"
            text
            outlined
            dense
          >
            {{ message }}
          </v-alert>
        </v-card>
      </v-card-text>
      <v-divider v-if="!loading"></v-divider>
      <v-card-actions v-if="!loading">
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
          @confirm="confirmDeleteVehicle"
          @cancel="deletingVehicle = false"
        ></delete-dialog>
      </v-dialog>
      <v-dialog max-width="500" v-model="editingVehicle">
        <edit-vehicle
          v-if="editingVehicle"
          :vehicle="vehicle"
          @cancel="editingVehicle = false"
          @vehicle-updated="vehicleUpdated"
        />
      </v-dialog>
      <v-dialog max-width="500" v-model="updateVehicleStatusModal">
        <UpdateVehicleStatus
          v-if="updateVehicleStatusModal"
          :vehicle="vehicle"
          @cancel="updateVehicleStatusModal = false"
          @vehicle-updated="vehicleUpdated"
        />
      </v-dialog>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import DeleteDialog from "../../../components/DeleteDialog.vue";
import EditVehicle from "./EditVehicle.vue";
import UpdateVehicleStatus from "./UpdateVehicleStatus.vue";

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
    editingVehicle: false,
    updateVehicleStatusModal: false,
    vehicle: null,
    loading: true,
    message: null,
    messageType: null
  }),
  methods: {
    goToCreateSale() {
      this.$router.push(`/create-sale/vehicle/${this.vehicleId}`)
    },
    editOnRoadSince() {

    },
    getFormattedValue(property) {
      switch (property.input_type) {
        case 'Text': return property.value;
        case 'Number': return property.value;
        case 'Currency': return `$ ${parseFloat(property.value).toFixed(2)}`;
        case 'Date': return property.value;
        case 'Dropdown': return property.value;
        case 'List': 
          if (Array.isArray(property.value) && property.value.length > 0) 
            return property.value.join();
          else
            return property.value;
        default: return property.value;
      }
    },
    showVehicleLocation() {
      this.$emit("show-vehicle-location");
    },
    vehicleUpdated(updatedVehicle) {
      this.vehicle = updatedVehicle;
      this.editingVehicle == false ? this.updateVehicleStatusModal = false : this.editingVehicle = false;
      this.showMessage('success', 'Vehicle has been updated successfully.');
    },
    confirmDeleteVehicle() {
      axios
        .delete(
          `${this.$store.state.baseApiUrl}/vehicles/${this.vehicleId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`
            }
          }
        )
        .then(() => {
          this.$emit("vehicle-deleted");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchVehicle() {
      axios
        .get(`${this.$store.state.baseApiUrl}/vehicles/${this.vehicleId}`, {
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then(response => {
          this.vehicle = response.data.payload;
          this.loading = false;
        })
        .catch(error => {
          console.log(error);
        })
    },
    showMessage(type, message) {
      this.messageType = type;
      this.message = message;
      setTimeout(() => {
        this.message = null;
        this.messageType = null;
      }, 4000);
    },
  },
  mounted() {
    this.fetchVehicle();
  },
  components: {
    DeleteDialog,
    EditVehicle,
    UpdateVehicleStatus,
  },
};
</script>

<style>
</style>