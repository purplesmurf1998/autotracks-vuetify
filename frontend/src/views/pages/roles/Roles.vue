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
        <v-toolbar-title>Account Roles</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" text @click="addingRole = true">
          <v-icon left dark> mdi-plus </v-icon>
          Add Account Role
        </v-btn>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="activeTab">
          <v-tab> Details </v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text>
          <!-- Roles and Permissions Sub Header -->
          <!-- <v-row v-if="activeTab == 0" class="pa-2" align="center">
            <p class="mb-0">
              {{ roleCount }} / 5 roles created for this account plan
            </p>
            <v-spacer />
            <v-btn
              color="primary"
              :class="$vuetify.breakpoint.mobile ? 'mt-2' : 'ml-2'"
              >Upgrade Plan</v-btn
            >
          </v-row> -->
        </v-card-text>
      </v-card>
    </v-card>
    <roles-table
      ref="rolesTable"
      @set-role-count="setRoleCount"
      v-if="activeTab == 0"
    />
    <v-dialog max-width="500" v-model="addingRole">
      <add-role
        v-if="addingRole"
        @cancel="addingRole = false"
        @role-created="roleCreated"
        :roleCount="roleCount"
      />
    </v-dialog>
  </div>
</template>

<script>
import RolesTable from "./RolesTable.vue";
import AddRole from "./AddRole.vue";

export default {
  name: "Dealership",

  data: () => ({
    activeTab: 0,
    addingRole: false,
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
      this.$refs.rolesTable.showMessage(
        "success",
        `Role '${role.title}' successfully created.`
      );
      this.$refs.rolesTable.fetchRoles();
    },
  },
  components: {
    RolesTable,
    AddRole,
  },
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
</style>