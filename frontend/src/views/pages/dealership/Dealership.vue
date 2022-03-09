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
        <v-btn color="primary" text rounded small v-if="activeTab == 0">
          <v-icon left dark> mdi-pencil </v-icon>
          Edit Details
        </v-btn>
        <v-btn color="primary" text rounded small v-if="activeTab == 1">
          <v-icon left dark> mdi-plus </v-icon>
          Add Account
        </v-btn>
        <v-btn
          color="primary"
          text
          rounded
          small
          v-if="activeTab == 2"
          @click="addingProperty = true"
        >
          <v-icon left dark> mdi-plus </v-icon>
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
          <v-icon left dark> mdi-plus </v-icon>
          Add Location
        </v-btn>
        <v-btn
          color="primary"
          text
          rounded
          small
          v-if="activeTab == 4"
          @click="addingRole = true"
        >
          <v-icon left dark> mdi-plus </v-icon>
          Add Account Role
        </v-btn>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="activeTab">
          <v-tab> Details </v-tab>
          <v-tab>
            <v-badge content="1" right> Accounts </v-badge>
          </v-tab>
          <v-tab>
            <v-badge content="1" right> Properties </v-badge>
          </v-tab>
          <v-tab> Locations </v-tab>
          <v-tab> Roles and Permissions </v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text>
          <!-- Accounts Sub Header -->
          <v-row v-if="activeTab == 1" class="pa-2" align="center">
            <v-text-field
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              placeholder="Search account by first name, last name, email, etc."
              hide-details
            ></v-text-field>
          </v-row>
          <!-- Properties Sub Header -->
          <v-row v-if="activeTab == 2" class="pa-2" align="center">
            <v-text-field
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              placeholder="Search property label, input type, or options"
              hide-details
              v-model="propertySearch"
            ></v-text-field>
            <v-spacer />
            <v-btn
              color="primary"
              :class="$vuetify.breakpoint.xs ? 'mt-2' : ''"
              @click="editingPropertyOrder = true"
            >
              <v-icon left dark class="mr-2"> mdi-pencil </v-icon>
              Edit property order
            </v-btn>
          </v-row>
          <!-- Locations Sub Header -->
          <v-row v-if="activeTab == 3" class="pa-2" align="center">
            <v-autocomplete
              :items="['Main Parking Lot', 'Secondary Parking Lot']"
              hide-selected
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              placeholder="Search location name"
              hide-details
            ></v-autocomplete>
            <v-spacer />
            <v-btn
              color="primary"
              :class="$vuetify.breakpoint.mobile ? 'mt-2' : 'mr-2'"
            >
              <v-icon left dark class="mr-2"> mdi-pencil </v-icon>
              Edit zone perimeters
            </v-btn>
            <v-btn
              color="primary"
              :class="$vuetify.breakpoint.mobile ? 'mt-2' : 'ml-2'"
            >
              <v-icon left dark class="mr-2"> mdi-table </v-icon>
              View list of locations
            </v-btn>
          </v-row>
          <!-- Roles and Permissions Sub Header -->
          <v-row v-if="activeTab == 4" class="pa-2" align="center">
            <p class="mb-0">
              {{ roleCount }} / 5 roles created for this account plan
            </p>
            <v-spacer />
            <v-btn
              color="primary"
              :class="$vuetify.breakpoint.mobile ? 'mt-2' : 'ml-2'"
              >Upgrade Plan</v-btn
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-card>
    <dealership-details id="dealership-details" v-if="activeTab == 0" />
    <dealership-accounts id="dealership-accounts" v-if="activeTab == 1" />
    <dealership-properties
      id="dealership-properties"
      ref="dealershipProperties"
      v-if="activeTab == 2"
      :propertySearch="propertySearch"
    />
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
    <dealership-roles
      id="dealership-roles"
      ref="dealershipRoles"
      @set-role-count="setRoleCount"
      v-if="activeTab == 4"
    />
    <v-dialog max-width="500" v-model="addingRole">
      <add-dealership-role
        v-if="addingRole"
        @cancel="addingRole = false"
        @role-created="roleCreated"
        :roleCount="roleCount"
      />
    </v-dialog>
    <v-dialog max-width="500" v-model="addingProperty">
      <add-dealership-property
        v-if="addingProperty"
        @cancel="addingProperty = false"
        @property-created="propertyCreated"
      />
    </v-dialog>
    <v-dialog max-width="500" v-model="editingPropertyOrder">
      <edit-property-order
        v-if="editingPropertyOrder"
        @cancel="editingPropertyOrder = false"
        @property-order-updated="propertyOrderUpdated"
      />
    </v-dialog>
  </div>
</template>

<script>
import DealershipDetails from "./details/DealershipDetails.vue";
import DealershipAccounts from "./accounts/DealershipAccounts.vue";
import DealershipProperties from "./properties/DealershipProperties.vue";
import DealershipZones from "./zones/DealershipZones.vue";
import DealershipRoles from "./authorization/DealershipRoles.vue";

import AddDealershipRole from "./authorization/AddDealershipRole.vue";
import AddDealershipProperty from "./properties/AddDealershipProperty.vue";
import EditPropertyOrder from "./properties/EditPropertyOrder.vue";

export default {
  name: "Dealership",

  data: () => ({
    activeTab: 0,
    addingAccount: false,
    addingProperty: false,
    editingPropertyOrder: false,
    addingZone: false,
    addingRole: false,
    propertySearch: "",
    roleCount: 0,
  }),
  methods: {
    setActiveTab(value) {
      this.activeTab = value;
    },
    setRoleCount(value) {
      this.roleCount = value;
    },
    roleCreated(role) {
      this.addingRole = false;
      this.$refs.dealershipRoles.showMessage(
        "success",
        `Role '${role.title}' successfully created.`
      );
      this.$refs.dealershipRoles.fetchRoles();
    },
    propertyCreated() {
      this.addingProperty = false;
      this.$refs.dealershipProperties.showMessage(
        "success",
        "Vehicle property created successfully."
      );
      this.$refs.dealershipProperties.fetchProperties();
    },
    propertyOrderUpdated() {
      this.editingPropertyOrder = false;
      this.$refs.dealershipProperties.showMessage(
        "success",
        "The order of the properties have been updated successfully."
      );
      this.$refs.dealershipProperties.fetchProperties();
    },
  },
  components: {
    DealershipDetails,
    DealershipAccounts,
    DealershipProperties,
    DealershipZones,
    DealershipRoles,
    AddDealershipRole,
    AddDealershipProperty,
    EditPropertyOrder,
  },
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
</style>