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
    <v-card width="90%" class="mx-auto mt-5">
      <v-data-table
        :headers="headers"
        :items="users"
        :items-per-page="5"
        item-key="_id"
        class="mb-5"
        :search="search"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editUser(item)" disabled>
            mdi-pencil
          </v-icon>
          <v-icon small color="error" @click="deleteUser(item)" disabled>
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:[`item.role_id`]="{ item }">
          {{ item.role_id ? item.role_id.title : "N/A" }}
        </template>
        <template v-slot:[`item.is_account_admin`]="{ item }">
          {{ item.is_account_admin ? "Yes" : "No" }}
        </template>
      </v-data-table>
    </v-card>
    <!-- Delete dialog -->
    <!-- <v-dialog
      transition="dialog-bottom-transition"
      width="500"
      v-model="deletingUser"
    >
      <delete-dialog
        dialogContent="Are you certain you want to delete this staff user?"
        @confirm="confirmDeleteUser"
        @cancel="deletingUser = false"
      />
    </v-dialog> -->
    <!-- Edit dialog -->
    <v-dialog
      transition="dialog-bottom-transition"
      width="500"
      v-model="editingUser"
    >
      <user-details
        v-if="editingUser"
        :user="selectedUser"
        @user-updated="userUpdated"
        @cancel="editingUser = null"
      />
    </v-dialog>
  </div>
</template>

<script>
import UserService from "../../../services/userService";
import { mapGetters } from "vuex";
// import DeleteDialog from "../../../components/DeleteDialog.vue";
import UserDetails from "./UserDetails.vue";

export default {
  name: "UsersTable",
  props: {
    search: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    deletingUser: false,
    selectedUser: null,
    editingUser: false,
    users: [],
    headers: [
      {
        text: "First Name",
        value: "display_name",
        align: "start",
      },
      {
        text: "Email",
        value: "email",
        align: "start",
      },
      {
        text: "Role",
        value: "role_id",
        align: "start",
      },
      {
        text: "Admin",
        value: "is_account_admin",
        align: "start",
      },
      {
        text: "Actions",
        value: "actions",
        align: "center",
        sortable: false,
      },
    ],
    message: null,
    messageType: null,
  }),
  computed: {
    ...mapGetters(["activeDealershipId", "accountId"]),
  },
  methods: {
    editUser(user) {
      this.selectedUser = user;
      this.editingUser = true;
    },
    userUpdated() {
      this.editingUser = false;
      this.selectedUser = null;
      this.fetchUsers();
      this.showMessage("success", `User has been successfully updated.`);
    },
    deleteUser(user) {
      this.selectedUser = user;
      this.deletingUser = true;
    },
    // confirmDeleteUser() {
    //   axios
    //     .delete(
    //       `${this.$store.state.baseApiUrl}/users/${this.selectedUser._id}`,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${this.$store.state.token}`,
    //         },
    //       }
    //     )
    //     .then(() => {
    //       this.deletingUser = false;
    //       this.fetchUsers();
    //       this.showMessage("success", `User has been successfully deleted.`);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // },
    showMessage(type, message) {
      this.messageType = type;
      this.message = message;
      setTimeout(() => {
        this.message = null;
        this.messageType = null;
      }, 4000);
    },
    fetchUsers() {
      UserService.getDealershipUsers(this.accountId, this.activeDealershipId)
        .then((response) => {
          this.users = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  components: {
    // DeleteDialog,
    UserDetails,
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>
