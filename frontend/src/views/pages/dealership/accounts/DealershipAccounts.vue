<template>
  <v-card width="90%" class="mx-auto mt-5">
    <v-card-title> Accounts </v-card-title>
    <v-data-table
      :headers="headers"
      :items="accounts"
      :items-per-page="5"
      :single-expand="true"
      :expanded.sync="expanded"
      item-key="_id"
      show-expand
    >
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <account-details :account="item" :key="item._id" />
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import AccountDetails from "./AccountDetails.vue";

export default {
  name: "DealershipAccounts",

  data: () => ({
    expanded: [],
    accounts: [
      {
        _id: "1",
        firstName: "Cedrik",
        lastName: "Dubois",
        email: "cedrikdubois98@gmail.com",
        role: "Management",
        permissions: [
          "Create Dealership",
          "Edit Dealership",
          "View Dealership",
          "Delete Dealership",
          "Create Account",
          "Edit Account",
          "View Account",
          "Delete Account",
          "Create Vehicle Property",
          "Edit Vehicle Property",
          "View Vehicle Property",
          "Delete Vehicle Property",
          "Create Vehicle",
          "Edit Vehicle",
          "View Vehicle",
          "Delete Vehicle",
        ],
      },
      {
        _id: "2",
        firstName: "Chloe",
        lastName: "Gratton",
        email: "chloegratton@live.ca",
        role: "Reception",
        permissions: [
          "Create Account",
          "Edit Account",
          "View Account",
          "Create Vehicle",
          "Edit Vehicle",
          "View Vehicle",
          "Delete Vehicle",
        ],
      },
    ],
    headers: [
      {
        text: "First Name",
        value: "firstName",
        align: "start",
      },
      {
        text: "Last Name",
        value: "lastName",
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
        align: "center",
      },
    ],
  }),
  methods: {
    showAccountDetails(account, slot) {
      slot.expand(!slot.isExpanded);
    },
  },
  components: {
    AccountDetails,
  },
};
</script>