<template>
  <div>
    <v-card flat>
      <v-toolbar
        color="grey lighten-4"
        extension-height="50"
        extended
        flat
        class="top-toolbar"
      >
        <v-toolbar-title>Vehicles</v-toolbar-title>
        <v-spacer />
        <v-btn
          color="primary"
          text
          rounded
          small
          v-if="!$vuetify.breakpoint.mobile"
          @click="editingPropertyOrder = true"
        >
          <v-icon left dark class="mr-2"> mdi-table-column </v-icon>
          Edit Columns
        </v-btn>
        <v-btn
          color="primary"
          text
          rounded
          small
          v-if="!$vuetify.breakpoint.mobile"
          @click="addingVehicle = true"
        >
          <v-icon left dark class="mr-2"> mdi-plus </v-icon>
          Add Vehicle
        </v-btn>
        <v-btn
          color="primary"
          text
          rounded
          small
          v-if="!$vuetify.breakpoint.mobile"
        >
          <v-icon left dark> mdi-download-outline </v-icon>
          Export
        </v-btn>
        <v-menu bottom left v-if="$vuetify.breakpoint.mobile">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-view-headline</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn
                color="primary"
                text
                rounded
                small
                @click="editingPropertyOrder = true"
              >
                <v-icon left dark class="mr-2"> mdi-table-column </v-icon>
                Edit Columns
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn
                color="primary"
                text
                rounded
                small
                @click="addingVehicle = true"
              >
                <v-icon left dark class="mr-2"> mdi-plus </v-icon>
                Add Vehicle
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn color="primary" text rounded small>
                <v-icon left dark class="mr-2"> mdi-download-outline </v-icon>
                Export
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="tabs">
          <v-tab> Inventory </v-tab>
          <v-tab> Sold </v-tab>
          <v-tab> Delivered </v-tab>
          <v-tab> Map </v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text>
          <v-row class="ma-0" align="center">
            <v-text-field
              v-model="search"
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              placeholder="Search by serial number, stock number, model etc."
              hide-details
            ></v-text-field>
            <v-spacer />
            <v-btn color="primary" small>
              <v-icon left class="mr-2"> mdi-plus </v-icon>
              Add Filter
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
      <div style="width: 90%" class="mx-auto" v-if="tabs < 3">
        <v-chip small color="primary" class="my-5 text-caption" rounded>
          {{ results }} result(s)
        </v-chip>
        <v-chip small color="secondary" class="my-5 ml-3 text-caption" rounded>
          No filters
        </v-chip>
      </div>
      <v-card width="90%" class="mx-auto" v-if="tabs < 3">
        <v-data-table
          :headers="headers"
          :items="items"
          :search="search"
          @click:row="setSelectedVehicle"
          @pagination="handlePagination"
          class="row-pointer"
        ></v-data-table>
      </v-card>
      <v-card width="90%" class="mx-auto my-10" v-if="tabs == 3">
        <GmapMap
          :center="center"
          :zoom="zoom"
          ref="mapRef"
          style="height: 600px"
          :options="{
            streetViewControl: false,
            fullscreenControl: true,
            rotateControl: false,
          }"
        ></GmapMap>
      </v-card>
    </v-card>
    <v-dialog
      v-model="showVehicleDetails"
      @click:outside="clearSelectedVehicle"
    >
      <vehicle-details
        v-if="showVehicleDetails"
        :vehicleId="showVehicleDetails"
        :clearSelectedVehicle="clearSelectedVehicle"
      />
    </v-dialog>
    <v-dialog max-width="500" v-model="editingPropertyOrder">
      <edit-property-order
        v-if="editingPropertyOrder"
        @cancel="editingPropertyOrder = false"
        @property-order-updated="propertyOrderUpdated"
      />
    </v-dialog>
    <v-dialog max-width="500" v-model="addingVehicle">
      <add-vehicle
        v-if="addingVehicle"
        @cancel="addingVehicle = false"
        @vehicle-added="vehicleAdded"
      />
    </v-dialog>
  </div>
</template>

<script>
const axios = require("axios");
import VehicleDetails from "./VehicleDetails.vue";
import EditPropertyOrder from "./EditPropertyOrder.vue";
import AddVehicle from "./AddVehicle.vue";
import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDnzuP55GknIhhOh5L1pJbpPc5DBkc_2pM",
  },
});

export default {
  name: "Inventory",

  data: () => ({
    tabs: 0,
    search: "",
    filters: [],
    results: 0,
    center: { lat: 45.431311, lng: -73.479005 },
    zoom: 19,
    editingPropertyOrder: false,
    addingVehicle: false,
    headers: [],
    inventory: [],
    sold: [],
    delivered: [],
  }),
  methods: {
    vehicleAdded(vehicle) {
      console.log(vehicle);
      this.addingVehicle = false;
      this.fetchVehicles();
    },
    setSelectedVehicle(item) {
      let query = {};

      query.vehicle = item._id;

      this.$router.replace({ query });
    },
    clearSelectedVehicle() {
      this.$router.replace({ query: {} });
    },
    handlePagination(pagination) {
      this.results = pagination.itemsLength;
    },
    propertyOrderUpdated() {
      this.editingPropertyOrder = false;
      this.fetchHeaders();
    },
    fetchHeaders() {
      axios
        .get(`${this.$store.state.baseApiUrl}/properties/order`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
            user: this.$store.state.loggedInUser._id,
          },
        })
        .then((response) => {
          let tempHeaders = [
            {
              text: "VIN",
              value: "vin",
            },
          ];

          response.data.payload.order.forEach((item) => {
            if (item.visible) {
              tempHeaders.push({
                text: item.property.label,
                value: item.property.key,
              });
            }
          });

          this.headers = tempHeaders;
          this.fetchVehicles();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchVehicles() {
      axios
        .get(`${this.$store.state.baseApiUrl}/vehicles`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
          },
        })
        .then((response) => {
          let tempInventory = [];
          response.data.payload.forEach((vehicle) => {
            let properties = vehicle.properties;
            properties.vin = vehicle.vin;
            properties._id = vehicle._id;
            tempInventory.push(properties);
          });
          this.inventory = tempInventory;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    items() {
      let tempItems = [];
      switch (this.tabs) {
        case 0:
          tempItems = this.inventory;
          break;
        case 1:
          tempItems = this.sold;
          break;
        case 2:
          tempItems = this.delivered;
      }

      if (this.filters.length == 0) {
        return tempItems;
      } else {
        return tempItems;
      }
    },
    showVehicleDetails() {
      return this.$route.query.vehicle;
    },
  },
  mounted() {
    this.fetchHeaders();
  },
  components: {
    VehicleDetails,
    EditPropertyOrder,
    AddVehicle,
  },
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}

.v-data-table {
  overflow: hidden !important;
  white-space: nowrap;
}
</style>