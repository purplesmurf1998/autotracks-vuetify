<template>
  <v-card>
    <v-card-title>
      Account Details
    </v-card-title>
    <v-card-text v-if="localAccount">
      <v-form
        ref="accountForm"
        v-model="accountFormValid"
        lazy-validation
      >
        <v-text-field 
          label="First Name" 
          outlined 
          dense 
          v-model="localAccount.first_name"
          append-icon="mdi-alphabetical"
          :rules="firstNameRules"
        />
        <v-text-field 
          label="Last Name" 
          outlined 
          dense 
          v-model="localAccount.last_name"
          append-icon="mdi-alphabetical"
          :rules="lastNameRules"
        />
        <v-text-field 
          label="Email" 
          outlined 
          dense 
          v-model="localAccount.email"
          append-icon="mdi-email-outline"
          disabled
        />
        <v-select
          :items="roles"
          outlined
          dense
          label="Role"
          v-model="localAccount.role._id"
          append-icon="mdi-account-cog-outline"
          :rules="roleRules"
        />
      </v-form>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="validateAccountForm">Save Changes</v-btn>
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "AccountDetails",
  props: {
    account: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    localAccount: null,
    roles: [],
    accountFormValid: true,
    firstNameRules: [(v) => !!v || "First name is required"],
    lastNameRules: [(v) => !!v || "Last name is required"],
    roleRules: [(v) => !!v || "Role is required"],
  }),
  methods: {
    validateAccountForm() {
      if (this.$refs.accountForm.validate()) this.save();
    },
    save() {
      // grab only the first name, last name and role
      const { first_name, last_name, role } = this.localAccount;
      const data = {
        first_name,
        last_name,
        role
      }

      axios
        .put(`${this.$store.state.baseApiUrl}/users/${this.account._id}`, data)
        .then(response => {
          this.$emit('account-updated', response.data.payload);
        })
        .catch(error => {
          console.log(error);
        })
    },
    cancel() {
      this.$emit('cancel');
    },
    fetchRoles() {
      axios
        .get(`${this.$store.state.baseApiUrl}/roles`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
          }
        })
        .then(response => {
          let tempRoles = [];
          response.data.payload.forEach(role => {
            tempRoles.push({
              text: role.title,
              value: role._id
            });
          })
          this.roles = tempRoles;
        })
        .catch(error => {
          console.log(error);
        })
    }
  },
  mounted() {
    this.localAccount = JSON.parse(JSON.stringify(this.account));
    this.fetchRoles();
  }
};
</script>

<style>
</style>