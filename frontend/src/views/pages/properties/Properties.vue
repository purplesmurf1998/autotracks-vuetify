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
        <v-toolbar-title>Vehicle Properties</v-toolbar-title>
        <v-spacer />
        <v-btn
          color="primary"
          text
          rounded
          small
          @click="addingProperty = true"
        >
          <v-icon left dark> mdi-plus </v-icon>
          Add Property
        </v-btn>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="activeTab">
          <v-tab> Table </v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text>
          <!-- Properties Sub Header -->
          <v-row v-if="activeTab == 0" class="pa-2" align="center">
            <v-text-field
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              placeholder="Search property label, input type, or options"
              hide-details
              v-model="propertySearch"
            ></v-text-field>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card>
    <properties-table
      id="dealership-properties"
      ref="dealershipProperties"
      v-if="activeTab == 0"
      :propertySearch="propertySearch"
    />
    <v-dialog max-width="500" v-model="addingProperty">
      <add-property
        v-if="addingProperty"
        @cancel="addingProperty = false"
        @property-created="propertyCreated"
      />
    </v-dialog>
  </div>
</template>

<script>
import PropertiesTable from "./PropertiesTable.vue";
import AddProperty from "./AddProperty.vue";

export default {
  name: "Properties",

  data: () => ({
    activeTab: 0,
    addingProperty: false,
    propertySearch: "",
  }),
  methods: {
    setActiveTab(value) {
      this.activeTab = value;
    },
    propertyCreated() {
      this.addingProperty = false;
      this.$refs.dealershipProperties.showMessage(
        "success",
        "Vehicle property created successfully."
      );
      this.$refs.dealershipProperties.fetchProperties();
    },
  },
  components: {
    PropertiesTable,
    AddProperty,
  },
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
</style>