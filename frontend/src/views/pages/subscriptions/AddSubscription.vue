<template>
  <v-card>
    <v-card-title class="text-h6"> Adding Subscription </v-card-title>
    <v-card-text>
      <v-select
        :items="['Vehicle Delivered', 'Vehicle Sold', 'Vehicle Available']"
        outlined
        dense
        label="Event Type"
        v-model="eventType"
      />
      <v-select
        :items="properties"
        outlined
        dense
        label="Property"
        v-model="property"
      />
      <v-autocomplete
            outlined
            dense
            label="Property Values"
            :items="vehiclePropertyValues"
            v-model="values"
            chips
            small-chips
            multiple
        />
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="add"> Add </v-btn>
      <v-btn color="secondary" text @click="cancel"> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const axios = require("axios");

export default {
  name: "AddProperty",

  data: () => ({
    eventType: "",
    property: "",
    values: null,
    vehiclePropertyValues: [],
    properties: [],
  }),
  methods: {
    fetchProperties() {
      axios
        .get(`${this.$store.state.baseApiUrl}/properties`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
          },
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then(response => {
            console.log(response.data.payload);
          //this.properties = response.data.payload;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchVehicles () { //This method is called when the modal is rendered to fetch all possible values for each vehicle property
      axios
        .get(`${this.$store.state.baseApiUrl}/vehicles`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
          },
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          let propertyValues = {};
          response.data.payload.forEach(vehicle => {
            for (const property in vehicle.properties) {
              if (propertyValues[property] === undefined)
                propertyValues[property] = [];
              if (!propertyValues[property].includes(vehicle.properties[property].value) && vehicle.properties[property].value != null && vehicle.properties[property].value.length != 0)
                propertyValues[property].push(vehicle.properties[property].value);
            }
          })
          console.log(propertyValues);
          //this.vehiclePropertyValues = propertyValues;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    add() {
      let subscription = {
        dealership: this.$store.state.loggedInUser.dealership,
        user: this.$store.state.loggedInUser._id,
        event_type: this.eventType,
        property: this.property,
        values: this.values,
      };

      axios
        .post(
          `${this.$store.state.baseApiUrl}/subscriptions`, 
          subscription,
          {
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`
            }
          }
        )
        .then((response) => {
          this.$emit("subscription-added", response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("cancel");
    },
  },
  mounted() {
    this.fetchProperties();
    this.fetchVehicles();
  },
};
</script>

<style>
</style>