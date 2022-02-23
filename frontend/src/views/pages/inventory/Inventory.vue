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
        <v-btn color="primary" text rounded small v-if="!$vuetify.breakpoint.mobile">
          <v-icon left dark class="mr-2"> mdi-table-column </v-icon>
          Edit Columns
        </v-btn>
        <v-btn color="primary" text rounded small v-if="!$vuetify.breakpoint.mobile">
          <v-icon left dark class="mr-2"> mdi-plus </v-icon>
          Add Vehicle
        </v-btn>
        <v-btn color="primary" text rounded small v-if="!$vuetify.breakpoint.mobile">
          <v-icon left dark> mdi-download-outline </v-icon>
          Export
        </v-btn>
        <v-menu bottom left v-if="$vuetify.breakpoint.mobile">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-view-headline</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn color="primary" text rounded small>
                <v-icon left dark class="mr-2"> mdi-table-column </v-icon>
                Edit Columns
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn color="primary" text rounded small>
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
          <v-text-field
            v-model="search"
            dense
            outlined
            prepend-inner-icon="mdi-magnify"
            placeholder="Search by serial number, stock number, model etc."
            hide-details
          ></v-text-field>
        </v-card-text>
      </v-card>
      <div style="width: 90%" class="mx-auto" v-if="tabs < 3">
        <v-chip small color="secondary" class="my-5 text-caption" rounded>
          {{ results }} result(s)
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
    <v-dialog v-model="showVehicleDetails" @click:outside="clearSelectedVehicle">
      <vehicle-details 
        v-if="showVehicleDetails" 
        :vehicleId="showVehicleDetails" 
        :clearSelectedVehicle="clearSelectedVehicle"
      />
    </v-dialog>
  </div>
</template>

<script>
import VehicleDetails from './VehicleDetails.vue'
import Vue from 'vue';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDnzuP55GknIhhOh5L1pJbpPc5DBkc_2pM',
  },
});

export default {
  name: "Inventory",

  data: () => ({
    tabs: 0,
    search: '',
    results: 0,
    center: { lat: 45.431311, lng: -73.479005 },
    zoom: 19,
    headers: [
      {
        text: "VIN",
        value: "vin",
      },
      {
        text: "Model #",
        value: "model-#",
      },
      {
        text: "Interior Color",
        value: "interior-color",
      },
      {
        text: "Exterior Color",
        value: "exterior-color",
      },
    ],
    inventory: [
      {
        '_id': '62157f5977dec1cf15fa88f4',
        'vin': '2C4GM68475R667819',
        'model-#': '7FT6SF',
        'interior-color': 'Black',
        'exterior-color': 'White',
        'on-road-since': null,
        'added-on': Date.now
      }
    ],
    sold: [
      {
        '_id': '62157f663cf86d463f9d6cde',
        'vin': '1FTSX21P05EC23578',
        'model-#': '7FT6SF',
        'interior-color': 'Black',
        'exterior-color': 'Black',
        'on-road-since': null,
        'added-on': Date.now
      },
      {
        '_id': '62157f6cae21964d423f7cc4',
        'vin': 'JH4DA3340HS032394',
        'model-#': 'F150TX',
        'interior-color': 'White',
        'exterior-color': 'White',
        'on-road-since': null,
        'added-on': Date.now
      }
    ],
    delivered: [

    ]
  }),
  methods: {
    setSelectedVehicle(item) {
      let query = {};

      query.vehicle = item._id;

      this.$router.replace({ query })
    },
    clearSelectedVehicle() {
      this.$router.replace({ query: {} });
    },
    handlePagination(pagination) {
      this.results = pagination.itemsLength;
    }
  },
  computed: {
    items() {
      switch (this.tabs) {
        case 0: return this.inventory;
        case 1: return this.sold;
        case 2: return this.delivered;
        default: return [];
      }
    },
    showVehicleDetails() {
      return this.$route.query.vehicle;
    }
  },
  components: {
    VehicleDetails
  }
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
</style>