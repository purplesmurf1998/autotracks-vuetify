<template>
  <v-card>
    <v-card-title> User Details </v-card-title>
    <v-card-text v-if="localUser">
      <v-form ref="userForm" v-model="userFormValid" lazy-validation>
        <v-text-field
          label="Display Name"
          outlined
          dense
          v-model="localUser.display_name"
          append-icon="mdi-alphabetical"
          :rules="displayNameRules"
        />
        <v-text-field
          label="Email"
          outlined
          dense
          v-model="localUser.email"
          append-icon="mdi-email-outline"
          disabled
        />
        <v-select
          :disabled="localUser.is_account_admin"
          :items="roles"
          outlined
          dense
          label="Role"
          v-model="localUser.role_id"
          append-icon="mdi-account-cog-outline"
          :rules="roleRules"
        />
        <v-checkbox
          v-model="localUser.is_account_admin"
          dense
          label="Is Account Admin"
        />
      </v-form>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="validateUserForm">Save Changes</v-btn>
      <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "UserDetails",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    localUser: null,
    roles: [],
    userFormValid: true,
    displayNameRules: [(v) => !!v || "Display name is required"],
    roleRules: [(v) => !!v || "Role is required"],
  }),
  methods: {
    validateUserForm() {
      if (this.$refs.userForm.validate()) this.save();
    },
    save() {
      axios
        .put(
          `${this.$store.state.baseApiUrl}/accounts/${this.$store.state.accountId}/users/${this.user._id}`,
          this.localUser,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        )
        .then((response) => {
          this.$emit("user-updated", response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("cancel");
    },
    fetchRoles() {
      axios
        .get(
          `${this.$store.state.baseApiUrl}/accounts/${this.$store.state.accountId}/dealerships/${this.$store.state.activeDealershipId}/roles`,
          {
            headers: {
              Authorization: `Bearer ${this.$store.state.token}`,
            },
          }
        )
        .then((response) => {
          let tempRoles = [];
          response.data.forEach((role) => {
            tempRoles.push({
              text: role.title,
              value: role._id,
            });
          });
          this.roles = tempRoles;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    let user = JSON.parse(JSON.stringify(this.user));
    user.role_id = user.role_id ? user.role_id._id : null;
    this.localUser = user;
    console.log(this.localUser);
    this.fetchRoles();
  },
};
</script>

<style></style>
