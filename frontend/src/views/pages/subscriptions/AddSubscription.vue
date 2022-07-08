<template>
  <v-card>
    <v-card-title class="text-h6"> Adding Subscription </v-card-title>
    <v-card-text>
        <v-form
            ref="subscriptionForm"
            v-model="subscriptionFormValid"
            lazy-validation
        >
            <v-select
                :items="['Vehicle Delivered', 'Vehicle Sold', 'Vehicle Available']"
                outlined
                dense
                label="Event Type"
                v-model="eventType"
                :menu-props="{offsetY: true }"
            />
            <v-select
                :items="properties"
                outlined
                dense
                label="Property"
                v-model="property"
                :menu-props="{offsetY: true }"
            />
            <v-select
                v-model="selectedValues"
                outlined
                dense
                :items="propValues"
                label="Property Values"
                multiple
                :rules="rules"
                :disabled="property == '' || propValues.length == 0"
                :menu-props="{offsetY: true }">
                <template v-slot:prepend-item>
                    <v-list-item
                    ripple
                    @mousedown.prevent
                    @click="toggle"
                    >
                    <v-list-item-action>
                        <v-icon :color="selectedValues.length > 0 ? 'indigo darken-4' : ''">
                        {{ icon }}
                        </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>
                        Select All
                        </v-list-item-title>
                    </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                </template>
            </v-select>
        </v-form>
      <!-- <v-autocomplete
            outlined
            dense
            label="Property Values"
            :items="vehiclePropertyValues"
            v-model="values"
            chips
            small-chips
            multiple
        /> -->
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="validateSubscriptionForm"> Add </v-btn>
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
    selectedValues: [],
    vehiclePropertyValues: [],
    properties: [],
    subscriptionFormValid: true,
  }),
  methods: {
    validateSubscriptionForm() {
      if (this.$refs.subscriptionForm.validate()) this.add();
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
        .then(response => {
            let tempProps = []
            console.log(response.data.payload);
            response.data.payload.forEach(prop => {
                tempProps.push(prop.label);
            })
            this.properties = tempProps;
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
          this.vehiclePropertyValues = propertyValues;
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
        values: this.selectedValues,
      };

      if (this.selectsAllValues)
        subscription['select_all'] = true;
        
      console.log(subscription);

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
    camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
    },
    toggle () {
        this.$nextTick(() => {
            if (this.selectsAllValues) {
            this.selectedValues = []
            } else {
            this.selectedValues = this.propValues.slice()
            }
        })
    },
  },
  computed: {
      selectsAllValues () {
        return this.selectedValues.length === this.propValues.length
      },
      selectsSomeValues () {
        return this.selectedValues.length > 0 && !this.selectsAllValues
      },
      icon () {
        if (this.selectsAllValues) return 'mdi-close-box'
        if (this.selectsSomeValues) return 'mdi-minus-box'
        return 'mdi-checkbox-blank-outline'
      },
      propValues() {
        if (this.property)
            return this.vehiclePropertyValues[this.camelize(this.property)]
        else
            return [];
      },
      rules () {
        if (this.property && this.selectedValues.length == 0)
            return ["You must select a value for the property"]
        else
            return [true];
      }
    },
  mounted() {
    this.fetchProperties();
    this.fetchVehicles();
  },
};
</script>

<style>
</style>