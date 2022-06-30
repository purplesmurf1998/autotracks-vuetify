<template>
  <v-card>
    <v-card-title class="text-h6"> Add Filter </v-card-title>
    <v-card-text>
      <v-row align="center" v-if="fields.length == 0"
        ><v-progress-circular indeterminate color="primary" class="mx-auto"
      /></v-row>
      <v-form
        v-if="fields.length > 0 && filters"
        ref="vehicleForm"
        v-model="vehicleFormValid"
        lazy-validation
      >
        <div v-for="field in fields" :key="field.key">
            <div v-if="field.input_type == 'Number' || field.input_type == 'Currency'">
                <v-row><label class="ml-3"/> {{field.label}} </v-row>
                <v-row>
                    <v-col>
                        <v-text-field
                            outlined
                            dense
                            v-model="filters[field.key][0]"
                            placeholder="Min Value"
                            append-icon="mdi-sort-numeric-variant"
                            :rules="[minRules[field.key]]"
                        />
                    </v-col>
                    <v-col>
                        <v-text-field
                            outlined
                            dense
                            v-model="filters[field.key][1]"
                            placeholder="Max Value"
                            append-icon="mdi-sort-numeric-variant"
                            :rules="[maxRules[field.key]]"
                        />
                    </v-col>
                </v-row>
            </div>
            <div v-if="field.input_type == 'Date'">
                <v-row>
                    <v-col>
                        <v-menu
                            :ref="date[field.key]"
                            v-model="date[field.key]"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="filters[field.key]"
                                :label="field.label"
                                append-icon="mdi-calendar"
                                v-bind="attrs"
                                v-on="on"
                                outlined
                                dense
                            />
                            </template>
                            <v-date-picker v-model="filters[field.key]" no-title scrollable range>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="cancelDate(field.key)">
                                Cancel
                            </v-btn>
                            <v-btn text color="primary" @click="okDate(field.key)">
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
            </div>
          <v-autocomplete
            v-if="field.input_type == 'Text' || field.input_type == 'Dropdown' || field.input_type == 'List'"
            outlined
            dense
            :label="field.label"
            :items="vehiclePropertyValues[field.key]"
            v-model="filters[field.key]"
            chips
            small-chips
            multiple
          />
        </div>
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="validateVehicleForm"> Save </v-btn>
      <v-btn color="secondary" text @click="cancel"> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const axios = require("axios");

export default {
  name: "AddFilter",
  props: ["inventoryFilters"],
  data: () => ({
    vehiclePropertyValues: {},
    filters: null,
    fields: [],
    fieldRules: {},
    vehicleFormValid: true,
    minRules: [],
    maxRules: [],
    date: {},
    activator: null,
  }),
  methods: {
    validateVehicleForm() {
      console.log(this.filters);
      if (this.$refs.vehicleForm.validate()) this.save();
    },
    okDate(key) {
      this.date[key] = false;
      console.log(this.filters[key])
    },
    cancelDate(key) {
      this.date[key] = false;
    },
    save() {
      // remove the vin from the vehicle object
      console.log("Saved")
      this.$emit("filter-added", this.filters);      
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
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          let tempFields = [];
          let tempMinRules = {};
          let tempMaxRules = {};
          let tempFilters = {};
          response.data.payload.forEach((property) => {
            if (property.input_type == "Number" || property.input_type == "Currency") { //This if statement is supposed to set the min and max rules for certain properties
              // tempMinRules[property.key] =
              //   (v) => {
              //     console.log(property.key);
              //     console.log(tempFilters[property.key][1])
              //     if (tempFilters[property.key][1] && v > tempFilters[property.key][1])
              //       return 'The min value must be smaller than the max value'
              //   };
              // tempMaxRules[property.key] =
              //   (v) => {
              //     console.log(property.key);
              //     console.log(tempFilters[property.key][0])
              //     console.log(v);
              //     if (tempFilters[property.key][0] != undefined) {
              //       if (v < tempFilters[property.key][0])
              //         return 'The max value must be greater than the max value'
              //       else if (v >= tempFilters[property.key][0])
              //         return true;
              //     }
              //     else
              //       return false;
              //   }
            }
            if (property.input_type == "Currency" || property.input_type == "Number" || property.input_type == "Date")
              tempFilters[property.key] = [null, null];
            else
              tempFilters[property.key] = [];
            tempFields.push({
              label: property.label,
              input_type: property.input_type,
              key: property.key,
              required: property.required,
              options: property.options,
            });
          });
          this.fields = tempFields;
          this.minRules = tempMinRules;
          this.maxRules = tempMaxRules;
          this.filters = this.inventoryFilters ? this.inventoryFilters : tempFilters;
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
              if (!propertyValues[property].includes(vehicle.properties[property].value) && vehicle.properties[property].value != null)
                propertyValues[property].push(vehicle.properties[property].value);
            }
          })
          this.vehiclePropertyValues = propertyValues;
        })
        .catch((error) => {
          console.log(error);
        });
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