<template>
  <v-card>
    <v-card-title class="text-h6"> Add Filter </v-card-title>
    <v-card-text>
      <v-row align="center" v-if="fields.length == 0"
        ><v-progress-circular indeterminate color="primary" class="mx-auto"
      /></v-row>
      <v-form
        v-if="fields.length > 0 && filters"
        ref="filterForm"
        v-model="filterFormValid"
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
                            type="number"
                            v-model="filters[field.key][0]"
                            placeholder="Min Value"
                            append-icon="mdi-sort-numeric-variant"
                        />
                    </v-col>
                    <v-col>
                        <v-text-field
                            outlined
                            dense
                            type="number"
                            v-model="filters[field.key][1]"
                            placeholder="Max Value"
                            append-icon="mdi-sort-numeric-variant"
                            :rules="[fieldRules[field.key]]"
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
      <v-btn color="primary" @click="validateFilterForm"> Save </v-btn>
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
    filterFormValid: true,
    date: {},
    activator: null,
  }),
  methods: {
    validateFilterForm() {
      if (this.$refs.filterForm.validate()) this.save();
    },
    okDate(key) {
      this.date[key] = false;
    },
    cancelDate(key) {
      this.date[key] = false;
    },
    save() {
      let payload = {};
      for (var filter in this.filters) { //Remove empty unused filters when the payload is sent to the inventory component
        if (this.filters[filter].length == 2) {
          if (this.filters[filter][0] != null || this.filters[filter][1] != null)
            payload[filter] = this.filters[filter];
        }
        else if (this.filters[filter].length != 0)
          payload[filter] = this.filters[filter];
      }
      this.$emit("filter-added", payload);      
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
          let tempRules = {};
          let tempFilters = {};
          response.data.payload.forEach((property) => {
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
            if (property.input_type == "Number" || property.input_type == "Currency") { //This if statement is supposed to set the min and max rules for certain properties
              tempRules[property.key] =
                (v) => {
                  if (!tempFilters[property.key][0] || v == null) //If one of the values or both are not defined, return true and use the value that is defined as a filter
                    return true;
                  else if (v < parseInt(tempFilters[property.key][0]))
                    return 'The max value must be greater than the min value';
                  else
                    return true;
                }
            }
          });
          this.fields = tempFields;
          this.fieldRules = tempRules;
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
              if (!propertyValues[property].includes(vehicle.properties[property].value) && vehicle.properties[property].value != null && vehicle.properties[property].value.length != 0)
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