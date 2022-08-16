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
        <v-toolbar-title>Users</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" text @click="addingUser = true" disabled>
          <v-icon left dark> mdi-plus </v-icon>
          Add User
        </v-btn>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="activeTab">
          <v-tab> Table </v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text>
          <!-- Users Sub Header -->
          <v-row class="pa-2" align="center">
            <v-text-field
              v-model="search"
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              placeholder="Search user by first name, last name, email, etc."
              hide-details
            ></v-text-field>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card>
    <users-table ref="usersTable" v-if="activeTab == 0" :search="search" />
    <v-dialog max-width="500" v-model="addingUser">
      <add-user
        v-if="addingUser"
        @cancel="addingUser = false"
        @user-created="userCreated"
      />
    </v-dialog>
  </div>
</template>

<script>
import UsersTable from "./UsersTable.vue";
import AddUser from "./AddUser.vue";

export default {
  name: "Users",

  data: () => ({
    activeTab: 0,
    addingUser: false,
    search: "",
  }),
  methods: {
    setActiveTab(value) {
      this.activeTab = value;
    },
    userCreated(user) {
      this.addingUser = false;
      this.$refs.usersTable.fetchUsers();
      this.$refs.usersTable.showMessage(
        "success",
        `User for the user ${user.first_name} ${user.last_name} has been created successfully.`
      );
    },
  },
  components: {
    UsersTable,
    AddUser,
  },
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
</style>
