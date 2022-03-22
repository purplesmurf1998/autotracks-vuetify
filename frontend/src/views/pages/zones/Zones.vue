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
        <v-toolbar-title>Zones</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" text @click="addZone">
          <v-icon left dark> mdi-plus </v-icon>
          Add Zone
        </v-btn>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="activeTab">
          <v-tab> Map </v-tab>
          <v-tab> List </v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text>
          <!-- Locations Sub Header -->
          <v-row class="pa-2" align="center">
            <v-autocomplete
              :items="['Main Parking Lot', 'Secondary Parking Lot']"
              v-model="selectedZone"
              hide-selected
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              placeholder="Search location name"
              hide-details
              clearable
            ></v-autocomplete>
            <v-spacer v-if="activeTab == 0" />
            <v-btn
              color="primary"
              :class="$vuetify.breakpoint.mobile ? 'mt-2' : 'mr-2'"
              v-if="activeTab == 0"
            >
              <v-icon left dark class="mr-2"> mdi-pencil </v-icon>
              Edit zone perimeter
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card>
    <zones-map
      v-if="activeTab == 0"
      :addingZone="addingZone"
      v-on:adding-zone="
        (val) => {
          addingZone = val;
        }
      "
    />
  </div>
</template>

<script>
import ZonesMap from "./ZonesMap.vue";

export default {
  name: "Dealership",

  data: () => ({
    activeTab: 0,
    addingZone: false,
    selectedZone: null,
  }),
  methods: {
    addZone() {
      this.activeTab = 0;
      this.addingZone = true;
    },
    setActiveTab(value) {
      this.activeTab = value;
    },
  },
  components: {
    ZonesMap,
  },
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
</style>