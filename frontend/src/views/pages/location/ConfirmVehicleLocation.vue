<template>
  <div class="app">
    <v-app>
      <v-main>
        <v-container fluid v-if="loading" fill-height>
          <v-row align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="primary"
              class="mx-auto my-auto"
            ></v-progress-circular>
          </v-row>
        </v-container>
        <v-dialog v-model="dialog" persistent>
          <v-card class="my-auto">
            <v-card-title class="text-h6">
              Update Vehicle Position
            </v-card-title>
            <v-card-text class="pt-3">
              <p class="text-lg-h6 font-weight-bold">VIN:</p>
              <p>{{ vehicle.vin }}</p>
              <p class="text-lg-h6 font-weight-bold">Latitude:</p>
              <p>{{ lat }}</p>
              <p class="text-lg-h6 font-weight-bold">Longitude:</p>
              <p>{{ lng }}</p>
              <p class="text-lg-h6 font-weight-bold">Predefined Location:</p>
              <p v-if="!zone">N/A</p>
              <p v-else>{{ zone.name }}</p>
              <p class="text-lg-h6 font-weight-bold">Date:</p>
              <p>{{ getDate }}</p>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions class="d-flex justify-center">
              <v-btn color="primary" text rounded @click="confirmLocation">
                Confirm Position
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "ConfirmVehicleLocation",

  data: () => ({
    lat: null,
    lng: null,
    zone: null,
    timestamp: null,
    vehicle: null,
    dialog: false,
    error: "",
    loading: true,
  }),
  methods: {
    getPosition(position) {
      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;
      this.timestamp = new Date(position.timestamp);
      this.loading = false;
      this.dialog = true;
    },
    showError(error) {
      this.error = error;
    },
    confirmLocation() {
      const data = {
        zone: this.zone ? this.zone._id : null,
        lat: this.lat,
        lng: this.lng,
      };

      axios
        .put(`${this.$store.state.baseApiUrl}/vehicles/${this.vehicle._id}`, {
          location: data,
        })
        .then(() => {
          this.$router.replace({ path: "/inventory" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchVehicle() {
      axios
        .get(
          `${this.$store.state.baseApiUrl}/vehicles/${this.$route.params.vehicleId}`
        )
        .then((response) => {
          this.vehicle = response.data.payload;
          // get the user's device's location
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              this.getPosition,
              this.showError
            );
          } else {
            this.error = "The browser does not support geolocation";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  computed: {
    getDate() {
      if (!this.timestamp) return null;

      let day = "";
      let month = "";
      let year = "";
      let hour = "";
      let minute = "";
      let second = "";

      day =
        this.timestamp.getDate() >= 10
          ? this.timestamp.getDate()
          : "0" + this.timestamp.getDate();
      month =
        this.timestamp.getMonth() + 1 >= 10
          ? this.timestamp.getMonth() + 1
          : "0" + (this.timestamp.getMonth() + 1);
      year = this.timestamp.getFullYear();
      hour =
        this.timestamp.getHours() >= 10
          ? this.timestamp.getDate()
          : "0" + this.timestamp.getHours();
      minute =
        this.timestamp.getMinutes() >= 10
          ? this.timestamp.getMinutes()
          : "0" + this.timestamp.getMinutes();
      second =
        this.timestamp.getSeconds() >= 10
          ? this.timestamp.getSeconds()
          : "0" + this.timestamp.getSeconds();

      return (
        day +
        "/" +
        month +
        "/" +
        year +
        " at " +
        hour +
        ":" +
        minute +
        ":" +
        second
      );
    },
  },
  beforeMount() {
    //TODO: Make sure this route is protected, and that the logged in user has access to this vehicle
    //      as well as access to modify this vehicle's location
  },
  mounted() {
    // get the vehicle
    this.fetchVehicle();
  },
};
</script>

<style>
</style>