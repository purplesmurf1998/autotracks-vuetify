<template>
  <v-card>
    <v-card-title class="text-h6" v-if="step == 1">
      <v-btn icon v-if="step == 1" @click="step = 0">
        <v-icon>mdi-arrow-left-circle-outline</v-icon>
      </v-btn>
      Confirm Details
    </v-card-title>
    <v-card-title class="text-h6" v-if="step == 0">
      Create New Dealership
    </v-card-title>
    <v-form
      ref="dealershipForm"
      v-model="dealershipFormValid"
      lazy-validation
      v-if="!loading && step == 0"
    >
      <v-card-text>
        <v-text-field
          label="Dealership Name"
          outlined
          v-model="dealershipName"
          dense
          required
          :rules="dealershipNameRules"
        />
        <v-text-field
          label="Street Address"
          outlined
          v-model="street"
          dense
          required
          :rules="streetRules"
        />
        <v-text-field
          label="City"
          outlined
          v-model="city"
          dense
          required
          :rules="cityRules"
        />
        <v-text-field
          label="Province / State"
          outlined
          v-model="provinceState"
          dense
          required
          :rules="provinceStateRules"
        />
        <v-text-field
          label="Country"
          outlined
          v-model="country"
          dense
          required
          :rules="countryRules"
        />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="validateDealershipForm"> Next </v-btn>
        <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-form>
    <div v-if="step == 1">
      <v-card-text>
        <v-row class="ma-0 px-5">
          <p class="font-weight-light login-text">Name</p>
          <v-spacer></v-spacer>
          <p class="font-weight-light login-text">
            {{ dealershipName }}
          </p>
        </v-row>
        <v-row class="ma-0 px-5">
          <p class="font-weight-light login-text">Address</p>
          <v-spacer></v-spacer>
          <p class="font-weight-light login-text">
            {{ formattedAddress }}
          </p>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="confirmCreate"> Create </v-btn>
        <v-btn color="secondary" text @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "AddDealership",

  data: () => ({
    loading: false,
    dealershipFormValid: true,
    step: 0,
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
    //dealership form rules
    dealershipNameRules: [(v) => !!v || "Name is required"],
    streetRules: [(v) => !!v || "Street address is required"],
    cityRules: [(v) => !!v || "City is required"],
    provinceStateRules: [(v) => !!v || "Province / state is required"],
    countryRules: [(v) => !!v || "Country is required"],
  }),
  methods: {
    confirmCreate() {
      axios
        .post(
          `${this.$store.state.baseApiUrl}/dealerships`, 
          {
            name: this.dealershipName,
            owner: this.$store.state.loggedInUser._id,
            geocoded_address: this.geocodedAddress,
            formatted_address: this.formattedAddress,
            lat: this.lat,
            lng: this.lng,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`
            }
          }
        )
        .then(() => {
          this.$emit("dealership-added");
        })
        .catch((error) => {
          this.errorMessage = error.message;
        });
    },
    geocodeDealership() {
      this.loading = true;
      axios
        .post(
        `${this.$store.state.baseApiUrl}/utilities/geocode`,
        {
          street: this.street,
          city: this.city,
          provinceState: this.provinceState,
          country: this.country,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        }
      )
      .then((response) => {
        this.geocodedAddress = response.data.payload;
        this.formattedAddress = this.geocodedAddress.formattedAddress;
        this.lat = this.geocodedAddress.latitude;
        this.lng = this.geocodedAddress.longitude;
        this.loading = false;
        this.step = this.step + 1;
      })
      .catch((error) => {
        this.loading = false;
        console.log(error);
      });
    },
    validateDealershipForm() {
      if (this.$refs.dealershipForm.validate()) this.geocodeDealership();
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style>
</style>