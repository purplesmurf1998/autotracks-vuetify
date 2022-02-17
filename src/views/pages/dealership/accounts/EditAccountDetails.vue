<template>
  <v-card>
    <v-card-title class="text-h6">
      Edit Account
    </v-card-title>
    <v-card-text class="pt-3">
      <v-row>
        <v-col>
          <v-text-field
            v-model="firstName"
            :error-messages="firstNameErrors"
            label="First Name"
            required
            dense
            outlined
            @input="$v.firstName.$touch()"
            @blur="$v.firstName.$touch()"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            v-model="lastName"
            :error-messages="lastNameErrors"
            label="Last Name"
            required
            dense
            outlined
            @input="$v.lastName.$touch()"
            @blur="$v.lastName.$touch()"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field
            v-model="email"
            :error-messages="emailErrors"
            label="E-mail"
            required
            dense
            outlined
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-combobox
            v-model="role"
            :items="roleItems"
            label="Role"
            dense
            outlined
          ></v-combobox>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-combobox
            v-model="permissions"
            :items="permissionItems"
            label="Permissions"
            dense
            outlined
            multiple
          ></v-combobox>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        @click="save"
        rounded
      >
        Save
      </v-btn>
      <v-btn
        color="secondary"
        text
        @click="cancel"
        rounded
      >
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, maxLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'EditAccountDetails',
  props: {
    account: {
      type: Object,
      required: true
    }
  },

  mixins: [validationMixin],
  validations: {
    firstName: { required, maxLength: maxLength(20) },
    lastName: { required, maxLength: maxLength(30) },
    email: { required, email }
  },

  data: () => ({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    permissions: [],
    roleItems: [
      'Management',
      'Sales Representative',
      'Reception',
      'Miscellaneous',
    ],
    permissionItems: [
      'Create Dealership',
          'Edit Dealership',
          'View Dealership',
          'Delete Dealership',
          'Create Account',
          'Edit Account',
          'View Account',
          'Delete Account',
          'Create Vehicle Property',
          'Edit Vehicle Property',
          'View Vehicle Property',
          'Delete Vehicle Property',
          'Create Vehicle',
          'Edit Vehicle',
          'View Vehicle',
          'Delete Vehicle'
    ]
  }),
  methods: {
    save() {
      this.$emit('close');
    },
    cancel() {
      this.firstName = this.account.firstName;
      this.lastName = this.account.lastName;
      this.email = this.account.email;
      this.role = this.account.role;
      this.permissions = this.account.permissions;
      this.$emit('close');
    }
  },
  computed: {
    firstNameErrors() {
      const errors = [];
      if (!this.$v.firstName.$dirty) return errors;

      !this.$v.firstName.maxLength && errors.push('First name must be at most 20 characters long');
      !this.$v.firstName.required && errors.push('First name is required.');

      return errors;
    },
    lastNameErrors() {
      const errors = [];
      if (!this.$v.lastName.$dirty) return errors;

      !this.$v.lastName.maxLength && errors.push('Last name must be at most 30 characters long');
      !this.$v.lastName.required && errors.push('Last name is required.');

      return errors;
    },
    emailErrors () {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;

      !this.$v.email.email && errors.push('Must be valid e-mail');
      !this.$v.email.required && errors.push('E-mail is required');

      return errors;
    },
  },
  mounted() {
    this.firstName = this.account.firstName;
    this.lastName = this.account.lastName;
    this.email = this.account.email;
    this.role = this.account.role;
    this.permissions = this.account.permissions;
  }
}
</script>

<style>

</style>