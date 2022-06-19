<template>
  <div style="height: 100%">
    <v-card flat style="height: 100%">
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
          v-if="!$vuetify.breakpoint.mobile"
          @click="editingPropertyOrder = true"
        >
          <v-icon left dark class="mr-2"> mdi-table-column </v-icon>
          Edit Columns
        </v-btn>
        <v-btn
          color="primary"
          text
          v-if="!$vuetify.breakpoint.mobile"
          @click="addingVehicle = true"
        >
          <v-icon left dark class="mr-2"> mdi-plus </v-icon>
          Add Vehicle
        </v-btn>
        <!-- <v-btn color="primary" text v-if="!$vuetify.breakpoint.mobile">
          <v-icon left dark> mdi-download-outline </v-icon>
          Export
        </v-btn> -->
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
                small
                @click="editingPropertyOrder = true"
              >
                <v-icon left dark class="mr-2"> mdi-table-column </v-icon>
                Edit Columns
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn color="primary" text small @click="addingVehicle = true">
                <v-icon left dark class="mr-2"> mdi-plus </v-icon>
                Add Vehicle
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn color="primary" text small>
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
              clearable
            ></v-text-field>
            <v-spacer />
            <v-btn color="primary">
              <v-icon left class="mr-2"> mdi-plus </v-icon>
              Add Filter
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
      <div style="width: 90%" class="mx-auto">
        <v-chip
          small
          color="primary"
          class="my-5 text-caption"
          rounded
          v-if="tabs < 3"
        >
          {{ results }} result(s)
        </v-chip>
        <v-chip
          small
          color="primary"
          class="my-5 text-caption"
          rounded
          v-if="tabs == 3"
        >
          {{ filteredMapInventory.length }} result(s)
        </v-chip>
        <v-chip small color="secondary" class="my-5 ml-3 text-caption" rounded>
          No filters
        </v-chip>
      </div>
      <v-card width="90%" class="mx-auto" v-if="tabs < 3">
        <v-data-table
          dense
          :headers="headers"
          :items="items"
          :search="search"
          :group-by="groupBy"
          @click:row="setSelectedVehicle"
          @pagination="handlePagination"
          class="row-pointer"
        >
          <template v-slot:[`item.status`]="{ item }">
            <v-icon
              small
              v-if="item.status == 'IN_REPAIR'"
              color="accent"
            >
              mdi-car-wrench
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
      <v-card width="90%" class="mx-auto mb-10" v-if="tabs == 3" style="height: 100%">
        <GmapMap
          :center.sync="center"
          :zoom="zoom"
          ref="mapRef"
          style="height: 100%"
          :options="{
            streetViewControl: false,
            fullscreenControl: true,
            rotateControl: false,
          }"
        >
          <GmapMarker
            :key="index"
            v-for="(v, index) in filteredMapInventory"
            :position="getLatLng(v.location)"
            :clickable="true"
            @click="center = getLatLng(v.location)"
          />
        </GmapMap>
      </v-card>
    </v-card>
    <v-dialog
      v-model="showVehicleDetails"
      max-width="800"
      @click:outside="clearSelectedVehicle"
    >
      <vehicle-details
        v-if="showVehicleDetails"
        :vehicleId="showVehicleDetails"
        :clearSelectedVehicle="clearSelectedVehicle"
        @vehicle-deleted="vehicleDeleted"
        @show-vehicle-location="viewVehicleLocation"
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
    groupBy: null,
    results: 0,
    center: { lat: 45.431311, lng: -73.479005 },
    zoom: 17,
    editingPropertyOrder: false,
    addingVehicle: false,
    headers: [],
    inventory: [],
    sold: [],
    delivered: [],
  }),
  methods: {
    viewVehicleLocation() {
      const vehicle = this.inventory.find(
        (vehicle) => vehicle._id == this.$route.query.vehicle
      );
      //this.clearSelectedVehicle();
      this.$router.push('/inventory')
      this.tabs = 3;
      this.search = vehicle.vin;
    },
    getLatLng(location) {
      if (!location) return null;
      console.log(location);
      return {
        lat: location.lat,
        lng: location.lng,
      };
    },
    vehicleDeleted() {
      this.$router.replace({ query: {} });
      this.fetchVehicles();
    },
    vehicleAdded() {
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
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          let tempHeaders = [
            {
              text: "",
              align: "center",
              value: "status",
              width: "50"
            },
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

          this.groupBy = response.data.payload.group_by ? response.data.payload.group_by.value : null;
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
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          let tempInventory = [];
          response.data.payload.forEach((vehicle) => {
            // eslint-disable-next-line no-unused-vars
            let properties = Object.keys(vehicle.properties).reduce((result, item, index) => {
              result[item] = vehicle.properties[item].value;
              return result;
            }, {});
            properties.vin = vehicle.vin;
            properties.status = vehicle.status;
            properties._id = vehicle._id;
            properties.location = vehicle.location;
            tempInventory.push(properties);
          });
          this.inventory = tempInventory;
          this.center = {
            lat: this.inventory[0].location.lat,
            lng: this.inventory[0].location.lng,
          };
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
    showVehicleDetails: {
      get() {
        return this.$route.query.vehicle;
      },
      set(value) {
        return value;
      }
    },
    filteredMapInventory() {
      let vehicles = this.inventory.filter((vehicle) => {
        if (this.search == "" || !this.search) return vehicle.location;
        if (vehicle.location) {
          // eslint-disable-next-line no-unused-vars
          for (const [key, value] of Object.entries(vehicle)) {
            if (value.toString().startsWith(this.search)) return true;
          }
        }
      });

      return vehicles;
    },
  },
  watch: {
    filteredMapInventory(newVal) {
      if (!this.$refs.mapRef) return;

      let newCenter = {};
      if (newVal.length == 0) {
        newCenter.lat = this.$store.state.dealership.lat;
        newCenter.lng = this.$store.state.dealership.lng;
      } else {
        newCenter.lat = newVal[0].location.lat;
        newCenter.lng = newVal[0].location.lng;
      }
      this.$refs.mapRef.panTo(newCenter);
    },
    showVehicleDetails(newVal) {
      if (newVal) {
        this.tabs = 0;
      }
    }
  },
  mounted() {
    this.fetchHeaders();
    this.center = {
      lat: this.$store.state.dealership.lat,
      lng: this.$store.state.dealership.lng,
    }
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