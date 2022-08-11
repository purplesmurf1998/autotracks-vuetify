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
          class="mr-2"
          @click="editingPropertyOrder = true"
        >
          <v-icon left dark class="mr-2"> mdi-table-column </v-icon>
          Edit Columns
        </v-btn>
        <v-btn
          color="primary"
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
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="tabs">
          <v-tab> Inventory </v-tab>
          <v-tab> Sold </v-tab>
          <v-tab> Delivered </v-tab>
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
            <v-btn text color="primary" @click="addingFilter = true">
              <v-icon left class="mr-2"> mdi-plus </v-icon>
              Add Filter
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
      <div style="width: 90%" class="mx-auto">
        <v-chip small color="primary" class="my-5 text-caption" rounded>
          {{ results }} result(s)
        </v-chip>
        <v-chip
          v-if="filtersSelected == 0"
          small
          color="secondary"
          class="my-5 ml-3 text-caption"
          rounded
        >
          No filters
        </v-chip>
        <v-chip
          v-if="filtersSelected > 0"
          small
          color="primary"
          class="my-5 ml-3 text-caption"
          rounded
          @click="clearFilters"
        >
          {{ filtersSelected }} filter(s)
          <v-icon small>mdi-close</v-icon>
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
            <v-icon small v-if="item.status == 'IN_STOCK'" color="success">
              mdi-car
            </v-icon>
            <v-icon small v-if="item.status == 'SOLD'" color="success">
              mdi-handshake
            </v-icon>
            <v-icon small v-if="item.status == 'IN_REPAIR'" color="accent">
              mdi-car-wrench
            </v-icon>
            <v-icon small v-if="item.status == 'DELIVERED'" color="success">
              mdi-truck-fast
            </v-icon>
          </template>
        </v-data-table>
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
    <v-dialog max-width="500" v-model="addingFilter">
      <add-filter
        v-if="addingFilter"
        @cancel="addingFilter = false"
        @filter-added="filterAdded"
        :inventoryFilters="inventoryFilters"
      />
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import InventoryService from "../../../services/inventoryService";
import VehicleDetails from "./VehicleDetails.vue";
import EditPropertyOrder from "./EditPropertyOrder.vue";
import AddVehicle from "./AddVehicle.vue";
import AddFilter from "./AddFilter.vue";
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
    inventoryFilters: null,
    search: "",
    filters: [],
    groupBy: null,
    results: 0,
    center: { lat: 45.431311, lng: -73.479005 },
    zoom: 17,
    editingPropertyOrder: false,
    addingVehicle: false,
    addingFilter: false,
    filtersSelected: 0,
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
      this.$router.push("/inventory");
      this.tabs = 3;
      this.search = vehicle.vin;
    },
    vehicleDeleted() {
      this.$router.replace({ query: {} });
      this.fetchVehicles();
    },
    vehicleAdded() {
      this.addingVehicle = false;
      this.fetchVehicles();
    },
    clearFilters() {
      this.fetchVehicles();
      this.filtersSelected = 0;
    },
    filterAdded(payload) {
      this.filtersSelected += Object.keys(payload).length;
      this.addingFilter = false;
      let filteredInventory = [];
      if (Object.keys(payload).length == 0)
        //if no filter is selected
        return;
      this.inventory.forEach((currentVehicle) => {
        let vehiclePassedFilters = true;
        for (var key in payload) {
          if (!currentVehicle[key]) vehiclePassedFilters = false;
          else if (
            payload[key].length == 2 &&
            payload[key][0] == null &&
            parseInt(currentVehicle[key]) > parseInt(payload[key][1])
          )
            //Min is null, max is set
            vehiclePassedFilters = false;
          else if (
            payload[key].length == 2 &&
            payload[key][1] == null &&
            parseInt(currentVehicle[key]) < parseInt(payload[key][0])
          )
            //Min is set, max is null
            vehiclePassedFilters = false;
          else if (
            payload[key].length == 2 &&
            payload[key][0] != null &&
            payload[key][1] != null &&
            !isNaN(payload[key][0]) &&
            !isNaN(payload[key][1]) &&
            (parseInt(currentVehicle[key]) < parseInt(payload[key][0]) ||
              parseInt(currentVehicle[key]) > parseInt(payload[key][1]))
          )
            //Min & Max are set
            vehiclePassedFilters = false;
          else if (
            payload[key].length == 2 &&
            !isNaN(Date.parse(payload[key][0])) &&
            !isNaN(Date.parse(payload[key][1])) &&
            (Date.parse(currentVehicle[key]) <= Date.parse(payload[key][0]) ||
              Date.parse(currentVehicle[key]) >= Date.parse(payload[key][1]))
          )
            //Date range is selected
            vehiclePassedFilters = false;
          else if (
            payload[key].length == 1 &&
            !isNaN(Date.parse(payload[key][0])) &&
            Date.parse(currentVehicle[key]) != Date.parse(payload[key][0])
          )
            //A single date is selected only.
            vehiclePassedFilters = false;
          else if (payload[key].length >= 1 && Array.isArray(payload[key][0])) {
            //This statement handles List input_type
            let flag = false;
            payload[key].forEach((item) => {
              if (JSON.stringify(currentVehicle[key]) == JSON.stringify(item))
                flag = true;
            });
            if (!flag) vehiclePassedFilters = false;
          } else if (
            payload[key].length >= 1 &&
            isNaN(payload[key][0]) &&
            isNaN(Date.parse(payload[key][0]))
          ) {
            //This statement is supposed to handle Dropdown, and Text input types
            let flag = false;
            payload[key].forEach((item) => {
              if (currentVehicle[key] == item) flag = true;
            });
            if (!flag) vehiclePassedFilters = false;
          }
        }
        if (vehiclePassedFilters)
          //If the vehicle passed all the filters, return it
          filteredInventory.push(currentVehicle);
      });
      this.inventory = filteredInventory;
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
      InventoryService.getHeaders(this.activeDealershipId)
        .then((response) => {
          let tempHeaders = [
            {
              text: "",
              align: "center",
              value: "status",
              width: "50",
            },
            {
              text: "VIN",
              value: "vin",
            },
          ];

          response.data.property_order.forEach((item) => {
            if (item.visible) {
              tempHeaders.push({
                text: item.property_id.label,
                value: item.property_id.key,
              });
            }
          });

          this.groupBy = response.data.property_group_by_ids
            ? response.data.property_group_by_ids.value
            : null;
          this.headers = tempHeaders;
          this.fetchVehicles();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchVehicles() {
      InventoryService.getVehicles(this.activeDealershipId)
        .then((response) => {
          let tempInventory = [];
          response.data.forEach((vehicle) => {
            // eslint-disable-next-line no-unused-vars
            let properties = Object.keys(vehicle.properties).reduce(
              // eslint-disable-next-line no-unused-vars
              (result, item, index) => {
                result[item] = vehicle.properties[item].value;
                return result;
              },
              {}
            );
            properties.vin = vehicle.vin;
            properties.status = vehicle.status;
            properties._id = vehicle._id;
            properties.location = vehicle.location;
            tempInventory.push(properties);
          });
          this.inventory = tempInventory.filter(
            (vehicle) =>
              vehicle.status === "IN_STOCK" || vehicle.status === "IN_REPAIR"
          );
          this.sold = tempInventory.filter(
            (vehicle) =>
              vehicle.status === "SOLD" ||
              vehicle.status === "IN_DELIVERY" ||
              vehicle.status === "PREPPING"
          );
          this.delivered = tempInventory.filter(
            (vehicle) => vehicle.status === "DELIVERED"
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    ...mapGetters(["activeDealershipId"]),
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
      },
    },
  },
  watch: {
    showVehicleDetails(newVal) {
      if (newVal) {
        this.tabs = 0;
      }
    },
  },
  mounted() {
    this.fetchHeaders();
  },
  components: {
    VehicleDetails,
    EditPropertyOrder,
    AddVehicle,
    AddFilter,
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
