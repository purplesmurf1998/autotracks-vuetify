<template>
  <v-card>
    <v-card-title class="text-h6"> Add Vehicle </v-card-title>
    <v-card-text>
      <v-progress-circular
        indeterminate
        color="primary"
        v-if="fields.length == 0"
        class="mx-auto"
      />
      <v-form
        v-if="fields.length > 0"
        ref="vehicleForm"
        v-model="vehicleFormValid"
        lazy-validation
      >
        <div v-for="field in fields" :key="field.key">
          <v-text-field
            v-if="field.input_type == 'Text'"
            outlined
            dense
            :label="field.label"
            v-model="vehicle[field.key]"
            append-icon="mdi-alphabetical"
            :rules="fieldRules[field.key]"
          />
          <v-text-field
            v-if="field.input_type == 'Number'"
            outlined
            dense
            :label="field.label"
            v-model="vehicle[field.key]"
            type="number"
            append-icon="mdi-sort-numeric-variant"
            :rules="fieldRules[field.key]"
          />
          <v-text-field
            v-if="field.input_type == 'Currency'"
            outlined
            dense
            :label="field.label"
            v-model="vehicle[field.key]"
            type="number"
            append-icon="mdi-currency-usd"
            :rules="fieldRules[field.key]"
          />
          <v-menu
            :ref="field.key"
            v-if="field.input_type == 'Date'"
            v-model="dateMenus[field.key]"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="vehicle[field.key]"
                :label="field.label"
                append-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                outlined
                dense
                :rules="fieldRules[field.key]"
              />
            </template>
            <v-date-picker v-model="vehicle[field.key]" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="cancelDate(field.key)">
                Cancel
              </v-btn>
              <v-btn text color="primary" @click="dateMenus[field.key] = false">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
          <v-select
            outlined
            dense
            v-model="vehicle[field.key]"
            :items="field.options"
            :label="field.label"
            v-if="field.input_type == 'Dropdown'"
            :clearable="!field.required"
            :rules="fieldRules[field.key]"
          />
        </div>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="validateVehicleForm" rounded> Save </v-btn>
      <v-btn color="secondary" text @click="cancel" rounded> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const axios = require("axios");

export default {
  name: "AddVehicle",

  data: () => ({
    fields: [],
    vehicle: {},
    fieldRules: {},
    dateMenus: {},
    vehicleFormValid: true,
  }),
  methods: {
    validateVehicleForm() {
      if (this.$refs.vehicleForm.validate()) this.save();
    },
    cancelDate(key) {
      this.vehicle[key] = "";
      this.dateMenus[key] = false;
    },
    save() {
      // remove the vin from the vehicle object
      let properties = this.vehicle;
      let vin = properties.vin;
      delete properties.vin;
      axios
        .post(`${this.$store.state.baseApiUrl}/vehicles`, {
          dealership: this.$store.state.loggedInUser.dealership,
          vin,
          properties,
        })
        .then((response) => {
          this.$emit("vehicle-added", response.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("cancel");
    },
    fetchProperties() {
      axios
        .get(`${this.$store.state.baseApiUrl}/properties`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
          },
        })
        .then((response) => {
          let tempFields = [];
          let tempVehicle = {};
          let tempDateMenus = {};
          let tempFieldRules = {};
          tempFields.push({
            label: "VIN",
            input_type: "Text",
            key: "vin",
            required: true,
          });
          tempVehicle["vin"] = "";
          tempFieldRules["vin"] = [(v) => !!v || "VIN is required"];
          response.data.payload.forEach((property) => {
            tempFields.push({
              label: property.label,
              input_type: property.input_type,
              key: property.key,
              required: property.required,
              options: property.options,
            });
            tempVehicle[property.key] = "";
            if (property.input_type == "Date") {
              tempDateMenus[property.key] = false;
            }
            if (property.required) {
              tempFieldRules[property.key] = [
                (v) => !!v || `${property.label} is required`,
              ];
            }
          });
          this.fields = tempFields;
          this.vehicle = tempVehicle;
          this.dateMenus = tempDateMenus;
          this.fieldRules = tempFieldRules;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchProperties();
  },
};
</script>

<style>
</style>