<template>
  <v-card>
    <v-card-title class="text-h6"> Creating New User </v-card-title>
    <v-card-text>
      <v-form ref="userForm" v-model="userFormValid" lazy-validation>
        <v-text-field
          label="First Name"
          outlined
          dense
          v-model="firstName"
          append-icon="mdi-alphabetical"
        />
        <v-text-field
          label="Last Name"
          outlined
          dense
          v-model="lastName"
          append-icon="mdi-alphabetical"
        />
        <v-text-field
          label="Email"
          outlined
          dense
          v-model="email"
          append-icon="mdi-email-outline"
        />
        <v-select
          :items="roles"
          outlined
          dense
          label="Role"
          v-model="role"
          append-icon="mdi-account-cog-outline"
        />
        <v-divider class="mb-6" />
        <v-hover v-slot="{ hover }">
          <v-text-field
            label="Generated Password"
            outlined
            dense
            v-model="generatedPassword"
            readonly
            :type="hover ? 'text' : 'password'"
            append-icon="mdi-lock-outline"
            persistent-hint
            hint="Hover over the textfield to reveal the password"
          />
        </v-hover>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="validateUserForm"> Create </v-btn>
      <v-btn color="secondary" text @click="cancel"> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "AddUser",

  data: () => ({
    roles: [],
    userFormValid: true,
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    generatedPassword: "",
  }),
  methods: {
    validateUserForm() {
      if (this.$refs.userForm.validate()) this.save();
    },
    save() {
      let user = {
        dealership: this.$store.state.loggedInUser.dealership,
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        role: this.role,
        password: this.generatedPassword,
        owner: false,
        prompt_password_change: true,
      };

      axios
        .post(`${this.$store.state.baseApiUrl}/users`, user, {
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
        .then((response) => {
          this.$emit("user-created", response.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("cancel");
    },
    generatePassword() {
      var length = 8,
        charset =
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
      return retVal;
    },
    fetchRoles() {
      axios
        .get(`${this.$store.state.baseApiUrl}/roles`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
          },
          headers: {
            Authorization: `Bearer ${this.$store.state.token}`,
          },
        })
        .then((response) => {
          let tempRoles = [];
          response.data.payload.forEach((role) => {
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
    this.generatedPassword = this.generatePassword();
    this.fetchRoles();
  },
};
</script>

<style></style>
