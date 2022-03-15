<template>
  <div class="app">
    <v-app>
      <v-main>
        <v-container class="grey lighten-4" fluid fill-height>
          <v-col>
            <v-row justify="center">
              <p class="text-h3 font-weight-light login-text">Autotracks</p>
            </v-row>
            <v-row class="mb-3" justify="center">
              <p class="font-weight-light login-text" v-if="step == 1">
                Step 1. Register a new account!
              </p>
              <p class="font-weight-light login-text" v-if="step == 2">
                Step 2. Create your first dealership!
              </p>
              <p class="font-weight-light login-text" v-if="step == 3">
                Step 3. Confirm the details!
              </p>
            </v-row>
            <v-alert color="error" v-if="errorMessage">{{
              errorMessage
            }}</v-alert>
            <v-row justify="center">
              <v-progress-circular
                indeterminate
                color="primary"
                v-if="loading"
                class="mx-auto"
              ></v-progress-circular>
            </v-row>
            <v-card
              max-width="500"
              class="mx-auto pa-2"
              v-show="step == 1 && !loading"
            >
              <v-form
                ref="accountForm"
                v-model="accountFormValid"
                lazy-validation
              >
                <v-card-text>
                  <v-row class="ma-0">
                    <v-col class="ma-0 pl-0 py-0 pr-1">
                      <v-text-field
                        label="First Name"
                        outlined
                        v-model="firstName"
                        dense
                        autocomplete="off"
                        required
                        :rules="firstNameRules"
                      />
                    </v-col>
                    <v-col class="ma-0 pr-0 py-0 pl-1">
                      <v-text-field
                        label="Last Name"
                        outlined
                        v-model="lastName"
                        dense
                        autocomplete="off"
                        required
                        :rules="lastNameRules"
                      />
                    </v-col>
                  </v-row>
                  <v-text-field
                    label="Email"
                    outlined
                    v-model="email"
                    dense
                    autocomplete="off"
                    required
                    :rules="emailRules"
                  />
                  <v-text-field
                    label="Password"
                    type="password"
                    outlined
                    v-model="password"
                    dense
                    autocomplete="off"
                    required
                    :rules="passwordRules"
                  />
                  <v-text-field
                    label="Confirm Password"
                    type="password"
                    outlined
                    v-model="confirmPassword"
                    dense
                    autocomplete="off"
                    required
                    :rules="confirmPasswordRule"
                  />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    rounded
                    small
                    @click="validateAccountForm"
                  >
                    Next
                  </v-btn>
                  <v-spacer />
                  <p class="text-caption mb-0">
                    Already have an account?
                    <router-link to="login">Click here</router-link>
                  </p>
                </v-card-actions>
              </v-form>
            </v-card>
            <v-card
              max-width="500"
              class="mx-auto pa-2"
              v-show="step == 2 && !loading"
            >
              <v-form
                ref="dealershipForm"
                v-model="dealershipFormValid"
                lazy-validation
              >
                <v-card-text>
                  <v-text-field
                    label="Dealership Name"
                    outlined
                    v-model="dealershipName"
                    dense
                    autocomplete="off"
                    required
                    :rules="dealershipNameRules"
                  />
                  <v-text-field
                    label="Street Address"
                    outlined
                    v-model="street"
                    dense
                    autocomplete="off"
                    required
                    :rules="streetRules"
                  />
                  <v-text-field
                    label="City"
                    outlined
                    v-model="city"
                    dense
                    autocomplete="off"
                    required
                    :rules="cityRules"
                  />
                  <v-text-field
                    label="Province / State"
                    outlined
                    v-model="provinceState"
                    dense
                    autocomplete="off"
                    required
                    :rules="provinceStateRules"
                  />
                  <v-text-field
                    label="Country"
                    outlined
                    v-model="country"
                    dense
                    autocomplete="off"
                    required
                    :rules="countryRules"
                  />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                  <v-btn color="secondary" text small rounded @click="goBack"
                    >Go Back</v-btn
                  >
                  <v-btn
                    color="primary"
                    rounded
                    @click="validateDealershipForm"
                    small
                  >
                    Next
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
            <v-card
              max-width="500"
              class="mx-auto pa-2"
              v-show="step == 3 && !loading"
            >
              <v-card-text>
                <p class="text-h6 font-weight-regular login-text">
                  Account Details
                </p>
                <v-row class="ma-0">
                  <p class="font-weight-light login-text">First Name</p>
                  <v-spacer></v-spacer>
                  <p class="font-weight-light login-text">{{ firstName }}</p>
                </v-row>
                <v-row class="ma-0">
                  <p class="font-weight-light login-text">Last Name</p>
                  <v-spacer></v-spacer>
                  <p class="font-weight-light login-text">{{ lastName }}</p>
                </v-row>
                <v-row class="ma-0">
                  <p class="font-weight-light login-text">Email</p>
                  <v-spacer></v-spacer>
                  <p class="font-weight-light login-text">{{ email }}</p>
                </v-row>
                <p class="text-h6 font-weight-regular login-text">
                  Dealership Details
                </p>
                <v-row class="ma-0">
                  <p class="font-weight-light login-text">Name</p>
                  <v-spacer></v-spacer>
                  <p class="font-weight-light login-text">
                    {{ dealershipName }}
                  </p>
                </v-row>
                <v-row class="ma-0">
                  <p class="font-weight-light login-text">Address</p>
                  <v-spacer></v-spacer>
                  <p class="font-weight-light login-text">
                    {{ formattedAddress }}
                  </p>
                </v-row>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="secondary" text small rounded @click="goBack"
                  >Go Back</v-btn
                >
                <v-btn
                  color="primary"
                  rounded
                  @click="confirmRegistration"
                  small
                >
                  Confirm Registration
                </v-btn>
              </v-card-actions>
            </v-card>
            <v-container v-if="!loading" class="mt-5">
              <v-progress-linear
                :value="progress"
                color="primary"
                rounded
              ></v-progress-linear>
            </v-container>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
const axios = require("axios");

export default {
  name: "Register",

  data: () => ({
    step: 1,
    accountFormValid: true,
    dealershipFormValid: true,
    errorMessage: null,
    loading: false,
    // account form rules
    firstNameRules: [(v) => !!v || "First name is required"],
    lastNameRules: [(v) => !!v || "Last name is required"],
    emailRules: [
      (v) => !!v || "E-mail is required",
      (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
    ],
    passwordRules: [(v) => !!v || "Password is required"],
    //dealership form rules
    dealershipNameRules: [(v) => !!v || "Name is required"],
    streetRules: [(v) => !!v || "Street address is required"],
    cityRules: [(v) => !!v || "City is required"],
    provinceStateRules: [(v) => !!v || "Province / state is required"],
    countryRules: [(v) => !!v || "Country is required"],
    // account properties
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    owner: true,
    // dealership properties
    dealershipName: "",
    street: "",
    city: "",
    provinceState: "",
    country: "",
    lat: 0,
    lng: 0,
    formattedAddress: "",
    geocodedAddress: null,
    // post registration
    token: null,
  }),
  methods: {
    goForward() {
      this.step = this.step + 1;
    },
    goBack() {
      this.step = this.step - 1;
    },
    geocodeDealership() {
      this.loading = true;
      axios({
        method: "POST",
        url: `${this.$store.state.baseApiUrl}/utilities/geocode`,
        data: {
          street: this.street,
          city: this.city,
          provinceState: this.provinceState,
          country: this.country,
        },
      })
        .then((response) => {
          this.geocodedAddress = response.data.payload;
          this.formattedAddress = this.geocodedAddress.formattedAddress;
          this.lat = this.geocodedAddress.latitude;
          this.lng = this.geocodedAddress.longitude;
          this.loading = false;
          this.step = this.step + 1;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        })
        .then(() => {
          this.loading = false;
        });
    },
    validateAccountForm() {
      if (this.$refs.accountForm.validate()) this.goForward();
    },
    validateDealershipForm() {
      if (this.$refs.dealershipForm.validate()) this.geocodeDealership();
    },
    confirmRegistration() {
      this.registerAccount();
    },
    registerAccount() {
      // create the account
      axios
        .post(`${this.$store.state.baseApiUrl}/auth/register`, {
          first_name: this.firstName,
          last_name: this.lastName,
          email: this.email,
          password: this.password,
          owner: true,
        })
        .then((response) => {
          this.token = response.data.token;
          this.registerDealership(response.data.payload);
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    registerDealership(account) {
      // create the dealership
      axios
        .post(`${this.$store.state.baseApiUrl}/dealerships`, {
          name: this.dealershipName,
          owner: account._id,
          geocoded_address: this.geocodedAddress,
          formatted_address: this.formattedAddress,
          lat: this.lat,
          lng: this.lng,
        })
        .then((response) => {
          this.updateAccount(response.data.payload);
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    updateAccount(dealership) {
      // update the account to add the default dealership
      axios
        .put(`${this.$store.state.baseApiUrl}/users/${dealership.owner}`, {
          dealership: dealership._id,
        })
        .then(() => {
          localStorage.setItem("autotracksAuthToken", this.token);
          this.$router.push("/dashboard");
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
  },
  computed: {
    progress() {
      switch (this.step) {
        case 1:
          return "33";
        case 2:
          return "66";
        default:
          return "100";
      }
    },
    confirmPasswordRule() {
      return [
        () => this.password === this.confirmPassword || "Passwords must match",
      ];
    },
  },
};
</script>

<style>
.login-text {
  display: inline-block;
}
</style>