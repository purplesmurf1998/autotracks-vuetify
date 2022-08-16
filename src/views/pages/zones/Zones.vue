<template>
  <div style="height: 100%">
    <v-card flat>
      <v-toolbar
        color="grey lighten-4"
        extension-height="50"
        extended
        flat
        class="top-toolbar"
      >
        <v-toolbar-title>Locations</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" text @click="addLocation">
          <v-icon left dark> mdi-plus </v-icon>
          Add Location
        </v-btn>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="activeTab">
          <v-tab> List </v-tab>
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
          </v-row>
        </v-card-text>
      </v-card>
      <div style="width: 90%" class="mx-auto">
        <v-chip small color="primary" class="my-5 text-caption" rounded>
          0 result(s)
        </v-chip>
      </div>
      <v-card width="90%" class="mx-auto">
        <v-data-table
          dense
          :headers="headers"
          :items="[]"
          :search="search"
          class="row-pointer"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" disabled> mdi-map-outline </v-icon>
            <v-icon small color="error" @click="deleteUser(item)" disabled>
              mdi-pencil
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-card>
    <!-- <zones-map
      v-if="activeTab == 0"
      :addingZone="addingZone"
      v-on:adding-zone="
        (val) => {
          addingZone = val;
        }
      "
    /> -->
  </div>
</template>

<script>
// import ZonesMap from "./ZonesMap.vue";

export default {
  name: "Dealership",

  data: () => ({
    activeTab: 0,
    addingZone: false,
    selectedZone: null,
    search: "",
    headers: [
      {
        text: "Name",
        value: "name",
      },
      {
        text: "Address",
        value: "address",
      },
      {
        text: "# of Vehicles",
        value: "",
      },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
      },
    ],
  }),
  methods: {
    addLocation() {
      this.activeTab = 0;
      this.addingZone = true;
    },
    setActiveTab(value) {
      this.activeTab = value;
    },
  },
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
</style>
