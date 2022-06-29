<template>
  <v-card>
    <v-card-title class="text-h6"> Add Filter </v-card-title>
    <v-card-text>
      <v-row align="center" v-if="fields.length == 0"
        ><v-progress-circular indeterminate color="primary" class="mx-auto"
      /></v-row>

      <v-form
        v-if="fields.length > 0 && vehicle"
        ref="vehicleForm"
        v-model="vehicleFormValid"
        lazy-validation
      >
        <div v-for="field in fields" :key="field.key">
            <div v-if="field.input_type == 'Number' || field.input_type == 'Currency'">
                <label/> {{field.label}}
                <v-row>
                    <v-col>
                        <v-text-field
                            outlined
                            dense
                            label="Min Value"
                            v-model="vehicle[field.key].value"
                            append-icon="mdi-sort-numeric-variant"
                            :rules="fieldRules[field.key]"
                        />
                    </v-col>
                    <v-col>
                        <v-text-field
                            outlined
                            dense
                            label="Max Value"
                            v-model="vehicle[field.key].value"
                            append-icon="mdi-sort-numeric-variant"
                            :rules="fieldRules[field.key]"
                        />
                    </v-col>
                </v-row>
            </div>
            <div v-if="field.input_type == 'Date'">
                <label/> {{field.label}}
                <v-row>
                    <v-col>
                        <v-menu
                            :ref="date"
                            v-model="date"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            offset-y
                            min-width="auto"
                        >
                            <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="dateRangeText"
                                label="Date Range"
                                append-icon="mdi-calendar"
                                v-bind="attrs"
                                v-on="on"
                                outlined
                                dense
                            />
                            </template>
                            <v-date-picker v-model="dates" no-title scrollable range>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="cancelDate">
                                Cancel
                            </v-btn>
                            <v-btn text color="primary" @click="okDate">
                                OK
                            </v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-col>
                </v-row>
            </div>
          <v-text-field
            v-if="field.input_type == 'Text'"
            outlined
            dense
            :label="field.label"
            v-model="vehicle[field.key].value"
            append-icon="mdi-alphabetical"
            :rules="fieldRules[field.key]"
          />
          <v-select
            outlined
            dense
            v-model="vehicle[field.key].value"
            :items="field.options"
            :label="field.label"
            v-if="field.input_type == 'Dropdown'"
            offset-y
            :clearable="!field.required"
            :rules="fieldRules[field.key]"
          />
          <v-combobox
            v-model="vehicle[field.key].value"
            :filter="filter"
            :hide-no-data="!search"
            :items="items"
            :search-input.sync="search"
            hide-selected
            label="Options"
            outlined
            dense
            multiple
            small-chips
            v-if="field.input_type == 'List'"
          >
            <template v-slot:no-data>
              <v-list-item>
                <v-chip color="primary" label small>
                  {{ search }}
                </v-chip>
              </v-list-item>
            </template>
            <template v-slot:selection="{ attrs, item, parent, selected }">
              <v-chip
                v-bind="attrs"
                color="primary"
                :input-value="selected"
                label
                small
              >
                <span class="pr-2">
                  {{ item }}
                </span>
                <v-icon small @click="parent.selectItem(item)">
                  $delete
                </v-icon>
              </v-chip>
            </template>
            <template v-slot:item="{ index, item }">
              <v-text-field
                v-if="editing === item"
                v-model="editing"
                autofocus
                flat
                background-color="transparent"
                hide-details
                solo
                @keyup.enter="edit(index, item)"
              ></v-text-field>
              <v-chip v-else color="primary" dark label small>
                {{ item }}
              </v-chip>
              <v-spacer></v-spacer>
              <v-list-item-action @click.stop>
                <v-btn icon @click.stop.prevent="edit(index, item)">
                  <v-icon>{{
                    editing !== item ? "mdi-pencil" : "mdi-check"
                  }}</v-icon>
                </v-btn>
              </v-list-item-action>
            </template>
          </v-combobox>
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

  data: () => ({
    fields: [],
    vehicle: {},
    fieldRules: {},
    vehicleFormValid: true,
    dates: [],
    date: false,
    activator: null,
    editing: null,
    editingIndex: -1,
    items: [
      { header: "Start typing in the field to create a dropdown option" },
    ],
    search: null,
  }),
  methods: {
    validateVehicleForm() {
      if (this.$refs.vehicleForm.validate()) this.save();
    },
    okDate() {
      this.date = false;
      console.log(this.date);
      console.log(this.dates);
    },
    cancelDate() {
      this.date = false;
      this.dates = [];
    },
    save() {
      // remove the vin from the vehicle object
      let properties = this.vehicle;
      let vin = properties.vin;
      delete properties.vin;
      
      axios
        .post(
          `${this.$store.state.baseApiUrl}/vehicles`, 
          {
            dealership: this.$store.state.loggedInUser.dealership,
            vin: vin.value,
            properties,
          },
          {
            headers: {
              'Authorization': `Bearer ${this.$store.state.token}`
            }
          }
        )
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
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          console.log(response.data.payload)
          let tempFields = [];
          let tempVehicle = {};
          let tempFieldRules = {};
          response.data.payload.forEach((property) => {
            tempFields.push({
              label: property.label,
              input_type: property.input_type,
              key: property.key,
              required: property.required,
              options: property.options,
            });
            tempVehicle[property.key] = {
              label: property.label,
              value: "",
              input_type: property.input_type
            };
            if (property.required) {
              tempFieldRules[property.key] = [
                (v) => !!v || `${property.label} is required`,
              ];
            }
            if (property.input_type == "List") {
              tempVehicle[property.key].value = [];
              this.$watch(`vehicle.${property.key}.value`, (val, prev) => {
                if (!prev) return;
                if (val.length === prev.length) return;

                this.vehicle[property.key].value = val.map((v) => {
                  return v;
                });
              });
            }
          });
          this.fields = tempFields;
          this.vehicle = tempVehicle;
          this.fieldRules = tempFieldRules;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    edit(index, item) {
      if (!this.editing) {
        this.editing = item;
        this.editingIndex = index;
      } else {
        this.editing = null;
        this.editingIndex = -1;
      }
    },
    filter(item, queryText, itemText) {
      if (item.header) return false;

      const hasValue = (val) => (val != null ? val : "");

      const text = hasValue(itemText);
      const query = hasValue(queryText);

      return (
        text.toString().toLowerCase().indexOf(query.toString().toLowerCase()) >
        -1
      );
    },
  },
  mounted() {
    this.fetchProperties();
  },
  computed: {
    dateRangeText () {
      return this.dates.join(' ~ ')
    },
  },
};
</script>

<style>
</style>