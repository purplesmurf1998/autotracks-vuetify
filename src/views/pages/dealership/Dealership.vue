<template>
  <div>
    <v-card flat>
      <v-toolbar
        color="grey lighten-4"
        extension-height="50"
        extended
        flat
        class="px-10"
      >
        <v-toolbar-title>Dealership</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" text rounded small v-if="activeTab == 0">
          <v-icon left dark class="mr-2"> mdi-pencil </v-icon>
          Edit Details
        </v-btn>
        <v-btn color="primary" text rounded small v-if="activeTab == 1">
          <v-icon left dark class="mr-2"> mdi-plus </v-icon>
          Add Account
        </v-btn>
        <v-btn color="primary" text rounded small v-if="activeTab == 2">
          <v-icon left dark class="mr-2"> mdi-plus </v-icon>
          Add Property
        </v-btn>
        <v-btn
          color="primary"
          text
          rounded
          small
          v-if="activeTab == 3"
          @click="addingZone = true"
        >
          <v-icon left dark class="mr-2"> mdi-plus </v-icon>
          Add Location
        </v-btn>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="activeTab">
          <v-tab> Details </v-tab>
          <v-tab> Accounts </v-tab>
          <v-tab> Properties </v-tab>
          <v-tab> Locations </v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text>
          <v-row v-if="activeTab == 2" class="pa-2" align="center">
            <v-text-field
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              placeholder="Search property name, input type, visible, etc."
              hide-details
            ></v-text-field>
            <v-spacer />
            <v-btn color="primary" small rounded>
              <v-icon left dark class="mr-2"> mdi-pencil </v-icon>
              Edit property order
            </v-btn>
          </v-row>
          <v-row v-if="activeTab == 3" class="pa-2" align="center">
            <v-text-field
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              placeholder="Search location name"
              hide-details
            ></v-text-field>
            <v-spacer />
            <v-btn color="primary" small rounded>
              <v-icon left dark class="mr-2"> mdi-pencil </v-icon>
              Edit zone perimeters
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card>
    <dealership-details id="dealership-details" v-if="activeTab == 0" />
    <dealership-accounts id="dealership-accounts" v-if="activeTab == 1" />
    <dealership-properties id="dealership-properties" v-if="activeTab == 2" />
    <dealership-zones
      id="dealership-zones"
      v-if="activeTab == 3"
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
import DealershipDetails from "./details/DealershipDetails.vue";
import DealershipAccounts from "./accounts/DealershipAccounts.vue";
import DealershipProperties from "./properties/DealershipProperties.vue";
import DealershipZones from "./zones/DealershipZones.vue";

export default {
  name: "Dealership",

  data: () => ({
    activeTab: 0,
    addingAccount: false,
    addingProperty: false,
    addingZone: false,
  }),
  methods: {
    setActiveTab(value) {
      this.activeTab = value;
    },
  },
  components: {
    DealershipDetails,
    DealershipAccounts,
    DealershipProperties,
    DealershipZones,
  },
};
</script>

<style>
</style>