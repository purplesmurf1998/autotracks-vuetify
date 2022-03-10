<template>
  <div>
    <v-alert
      :color="messageType"
      v-if="message"
      text
      outlined
      dense
      class="mx-auto mt-4 mb-0"
      style="width: 90%"
      >{{ message }}</v-alert
    >
    <v-row class="mx-auto" style="width: 90%">
      <v-col class="pl-0 mt-5">
        <p class="text-h5 font-weight-light">Account Roles</p>
        <v-card>
          <v-list class="pa-0">
            <v-list-item-group
              v-model="selectedRoleIndex"
              color="primary"
              mandatory
            >
              <v-list-item
                v-for="(role, index) in roles"
                :key="role._id"
                @click="toggleRole(role, index)"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="role.title"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-action @click="deletingRole = true">
                  <v-icon color="error">mdi-delete</v-icon>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
        <v-btn color="primary" class="mt-3" @click="openEditDialog">
          <v-icon left class="mr-2"> mdi-pencil </v-icon>
          Edit Role Name
        </v-btn>
      </v-col>
      <v-col class="pr-0 mt-5">
        <p class="text-h5 font-weight-light">Permissions</p>
        <v-text-field
          outlined
          dense
          placeholder="Search permissions"
          prepend-inner-icon="mdi-magnify"
          v-model="permissionSearch"
        />
        <v-row class="ma-0" v-if="selectedRole">
          <v-virtual-scroll :items="permissions" :item-height="35" height="300">
            <template v-slot:default="{ item }">
              <v-switch
                v-model="selectedRolePermissions[item]"
                @click="permissionToggled = !permissionToggled"
                inset
                color="primary"
                class="pl-2 mt-0"
                :label="item"
              />
            </template>
          </v-virtual-scroll>
        </v-row>
        <v-row v-if="werePermissionsModified" class="mb-3">
          <v-btn color="primary" @click="saveChanges" class="mr-2">
            Save Changes
          </v-btn>
          <v-btn color="secondary" text @click="cancelChanges">Cancel</v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-dialog v-model="editingRole" max-width="300">
      <v-card>
        <v-card-title class="text-h6"> Edit Role Title </v-card-title>
        <v-card-text>
          <v-text-field
            outlined
            v-model="selectedRole.title"
            v-if="selectedRole"
            dense
            hide-details
          />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveRoleTitle" rounded> Save </v-btn>
          <v-btn color="secondary" text @click="cancelEditDialog" rounded>
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      transition="dialog-bottom-transition"
      width="500"
      v-model="deletingRole"
    >
      <delete-dialog
        dialogContent="Are you sure you want to delete this role? Users with this role will have no more permissions"
        v-on:confirm="deleteRole"
        v-on:cancel="deletingRole = false"
      ></delete-dialog>
    </v-dialog>
  </div>
</template>

<script>
const axios = require("axios");

import DeleteDialog from "../../../components/DeleteDialog.vue";

export default {
  name: "RolesTable",

  data: () => ({
    selectedRoleIndex: 0,
    selectedRole: null,
    selectedRolePermissions: {},
    permissionToggled: true,
    permissionSearch: "",
    roles: [],
    // message props
    message: null,
    messageType: null,
    editingRole: false,
    deletingRole: false,
    originalRoleTitle: "",
  }),
  computed: {
    werePermissionsModified() {
      console.log(this.permissionToggled);
      if (!this.selectedRole) return false;
      let changes = false;
      this.selectedRole.permissions.forEach((value) => {
        const resource = value.resource;
        Object.keys(value.policy).forEach((key) => {
          if (
            this.selectedRolePermissions[key + "_" + resource] !=
            value.policy[key]
          )
            changes = true;
        });
      });

      return changes;
    },
    permissions() {
      return Object.keys(this.selectedRolePermissions).filter((title) =>
        title.includes(this.permissionSearch)
      );
    },
  },
  methods: {
    deleteRole() {
      axios
        .delete(
          `${this.$store.state.baseApiUrl}/roles/${this.selectedRole._id}`
        )
        .then(() => {
          this.deletingRole = false;
          this.selectedRole = null;
          this.selectedRoleIndex = 0;
          this.fetchRoles();
          this.showMessage("success", "Role successfully deleted.");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    openEditDialog() {
      this.originalRoleTitle = this.selectedRole.title;
      this.editingRole = true;
    },
    cancelEditDialog() {
      this.selectedRole.title = this.originalRoleTitle;
      this.originalRoleTitle = "";
      this.editingRole = false;
    },
    saveRoleTitle() {
      axios
        .put(`${this.$store.state.baseApiUrl}/roles/${this.selectedRole._id}`, {
          title: this.selectedRole.title,
        })
        .then((response) => {
          this.selectedRole = response.data.payload;
          this.originalRoleTitle = "";
          this.editingRole = false;
          this.showMessage("success", "Role title successfully modified.");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    saveChanges() {
      let temp_permissions = [];

      this.selectedRole.permissions.forEach((value, index) => {
        const resource = value.resource;
        temp_permissions[index] = {
          resource,
          policy: {},
        };
        Object.keys(value.policy).forEach((key) => {
          temp_permissions[index].policy[key] =
            this.selectedRolePermissions[key + "_" + resource];
        });
      });

      // submit changes to API
      axios
        .put(`${this.$store.state.baseApiUrl}/roles/${this.selectedRole._id}`, {
          permissions: temp_permissions,
        })
        .then((response) => {
          this.selectedRole = response.data.payload;
          this.showMessage("success", "Role profile successfully modified.");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancelChanges() {
      this.setSelectedRolePermissions();
    },
    toggleRole(role, index) {
      this.selectedRole = role;
      this.selectedRoleIndex = index;
      this.setSelectedRolePermissions();
    },
    showMessage(type, message) {
      this.messageType = type;
      this.message = message;
      setTimeout(() => {
        this.message = null;
        this.messageType = null;
      }, 4000);
    },
    setSelectedRolePermissions() {
      let temp_permissions = {};
      this.selectedRole.permissions.forEach((value) => {
        const resource = value.resource;
        Object.keys(value.policy).forEach((key) => {
          temp_permissions[key + "_" + resource] = value.policy[key];
        });
      });
      this.selectedRolePermissions = temp_permissions;
    },
    fetchRoles() {
      const dealershipId = this.$store.state.loggedInUser.dealership;

      axios
        .get(`${this.$store.state.baseApiUrl}/roles`, {
          params: {
            dealership: dealershipId,
          },
        })
        .then((response) => {
          console.log(response);
          this.roles = response.data.payload;
          this.selectedRole = !this.selectedRole
            ? this.roles[0]
            : this.selectedRole;
          this.setSelectedRolePermissions();
          this.$emit("set-role-count", this.roles.length);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  components: {
    DeleteDialog,
  },
  mounted() {
    this.fetchRoles();
  },
};
</script>

<style>
</style>