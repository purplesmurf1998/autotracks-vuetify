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
        <v-toolbar-title>Dealership</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" text @click="addingDealership = true">
          <v-icon left dark> mdi-plus </v-icon>
          Create New Dealership
        </v-btn>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="activeTab">
          <v-tab> Details </v-tab>
          <v-tab> List </v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text>
          <v-row class="pa-2" align="center" v-if="activeTab == 1">
            <p class="mb-0" v-if="dealershipCount">
              {{ dealershipCount }} / 5 dealerships created for this account
              plan
            </p>
            <v-spacer />
            <v-btn color="primary"> Upgrade Plan </v-btn>
          </v-row>
          <dealership-details id="dealership-details" v-if="activeTab == 0"/>
        </v-card-text>
      </v-card>
    </v-card>
    <dealerships-table ref="dealershipTable" v-if="activeTab == 1" @set-count="setDealershipCount"/>
    <v-dialog
      transition="dialog-bottom-transition"
      width="500"
      v-model="addingDealership"
    >
      <add-dealership
        v-if="addingDealership"
        @cancel="addingDealership = false"
        @dealership-added="dealershipAdded"
      />
    </v-dialog>
  </div>
</template>

<script>
import DealershipDetails from "./DealershipDetails.vue";
import DealershipsTable from "./DealershipsTable.vue";
import AddDealership from "./AddDealership.vue";

export default {
  name: "Dealership",

  data: () => ({
    activeTab: 0,
    dealershipCount: null,
    addingDealership: false,
  }),
  methods: {
    dealershipAdded() {
      this.$refs.dealershipTable.fetchDealerships();
      this.addingDealership = false;
    },
    setDealershipCount(value) {
      this.dealershipCount = value;
    },
    setActiveTab(value) {
      this.activeTab = value;
    },
  },
  components: {
    DealershipDetails,
    DealershipsTable,
    AddDealership,
  },
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
</style>