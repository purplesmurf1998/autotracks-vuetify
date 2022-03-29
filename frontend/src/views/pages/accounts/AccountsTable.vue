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
        :items="accounts"
        :items-per-page="5"
        item-key="_id"
        class="mb-5"
        :search="search"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editAccount(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="error" @click="deleteAccount(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:[`item.role`]="{ item }">
          {{ item.role.title }}
        </template>
      </v-data-table>
    </v-card>
    <!-- Delete dialog -->
    <v-dialog
      transition="dialog-bottom-transition"
      width="500"
      v-model="deletingAccount"
    >
      <delete-dialog
        dialogContent="Are you certain you want to delete this staff account?"
        @confirm="confirmDeleteAccount"
        @cancel="deletingAccount = false"
      />
    </v-dialog>
    <!-- Edit dialog -->
    <v-dialog
      transition="dialog-bottom-transition"
      width="500"
      v-model="editingAccount"
    >
      <account-details
        v-if="editingAccount"
        :account="selectedAccount"
        @account-updated="accountUpdated"
        @cancel="editingAccount = null"
      />
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import DeleteDialog from "../../../components/DeleteDialog.vue"
import AccountDetails from "./AccountDetails.vue"

export default {
  name: "AccountsTable",
  props: {
    search: {
      type: String,
      required: true
    }
  },
  data: () => ({
    deletingAccount: false,
    selectedAccount: null,
    editingAccount: false,
    accounts: [],
    headers: [
      {
        text: "First Name",
        value: "first_name",
        align: "start",
      },
      {
        text: "Last Name",
        value: "last_name",
        align: "start",
      },
      {
        text: "Email",
        value: "email",
        align: "start",
      },
      {
        text: "Role",
        value: "role",
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
    messageType: null
  }),
  methods: {
    editAccount(account) {
      this.selectedAccount = account;
      this.editingAccount = true;
    },
    accountUpdated() {
      this.editingAccount = false;
      this.selectedAccount = null;
      this.fetchAccounts();
      this.showMessage('success', `Account has been successfully updated.`);
    },
    deleteAccount(account) {
      this.selectedAccount = account;
      this.deletingAccount = true;
    },
    confirmDeleteAccount() {
      axios
        .delete(
          `${this.$store.state.baseApiUrl}/users/${this.selectedAccount._id}`, 
          {
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`
            }
          }
        )
        .then(() => {
          this.deletingAccount = false;
          this.fetchAccounts();
          this.showMessage('success', `Account has been successfully deleted.`);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    showMessage(type, message) {
      this.messageType = type;
      this.message = message;
      setTimeout(() => {
        this.message = null;
        this.messageType = null;
      }, 4000);
    },
    fetchAccounts() {
      axios
        .get(`${this.$store.state.baseApiUrl}/users`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
            populate: "role",
            owner: "false"
          },
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then(response => {
          this.accounts = response.data.payload;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  components: {
    DeleteDialog,
    AccountDetails
  },
  mounted() {
    this.fetchAccounts();
  }
};
</script>