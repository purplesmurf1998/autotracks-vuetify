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
        <v-toolbar-title>Accounts</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" text @click="addingAccount = true">
          <v-icon left dark> mdi-plus </v-icon>
          Add Account
        </v-btn>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="activeTab">
          <v-tab> Table </v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text>
          <!-- Accounts Sub Header -->
          <v-row class="pa-2" align="center">
            <v-text-field
              v-model="search"
              dense
              outlined
              prepend-inner-icon="mdi-magnify"
              placeholder="Search account by first name, last name, email, etc."
              hide-details
            ></v-text-field>
          </v-row>
        </v-card-text>
      </v-card>
    </v-card>
    <accounts-table ref="accountsTable" v-if="activeTab == 0" :search="search"/>
    <v-dialog max-width="500" v-model="addingAccount">
      <add-account
        v-if="addingAccount"
        @cancel="addingAccount = false"
        @account-created="accountCreated"
      />
    </v-dialog>
  </div>
</template>

<script>
import AccountsTable from "./AccountsTable.vue";
import AddAccount from "./AddAccount.vue"

export default {
  name: "Accounts",

  data: () => ({
    activeTab: 0,
    addingAccount: false,
    search: "",
  }),
  methods: {
    setActiveTab(value) {
      this.activeTab = value;
    },
    accountCreated(account) {
      this.addingAccount = false;
      this.$refs.accountsTable.fetchAccounts();
      this.$refs.accountsTable.showMessage('success', `Account for the user ${account.first_name} ${account.last_name} has been created successfully.`);
    },
  },
  components: {
    AccountsTable,
    AddAccount
  },
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
</style>