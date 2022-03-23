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
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="error" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:[`item.role`]="{ item }">
          {{ item.role.title }}
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "AccountsTable",

  data: () => ({
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
    editItem(item) {
      console.log(item);
    },
    deleteItem(item) {
      console.log(item);
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
  mounted() {
    this.fetchAccounts();
  }
};
</script>