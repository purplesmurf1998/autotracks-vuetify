<template>
<v-card>
	<v-card-title>
		Edit Vehicle Properties
	</v-card-title>
	<v-card-text>
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
            v-model="vehicleProperties[field.key].value"
            append-icon="mdi-alphabetical"
            :rules="fieldRules[field.key]"
          />
          <v-text-field
            v-if="field.input_type == 'Number'"
            outlined
            dense
            :label="field.label"
            v-model="vehicleProperties[field.key].value"
            type="number"
            append-icon="mdi-sort-numeric-variant"
            :rules="fieldRules[field.key]"
          />
          <v-text-field
            v-if="field.input_type == 'Currency'"
            outlined
            dense
            :label="field.label"
            v-model="vehicleProperties[field.key].value"
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
                v-model="vehicleProperties[field.key].value"
                :label="field.label"
                append-icon="mdi-calendar"
                v-bind="attrs"
                v-on="on"
                outlined
                dense
                :rules="fieldRules[field.key]"
              />
            </template>
            <v-date-picker v-model="vehicleProperties[field.key].value" no-title scrollable>
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
            v-model="vehicleProperties[field.key].value"
            :items="field.options"
            :label="field.label"
            v-if="field.input_type == 'Dropdown'"
            :clearable="!field.required"
            :rules="fieldRules[field.key]"
          />
          <v-combobox
            v-model="vehicleProperties[field.key].value"
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
			<v-btn color="primary" @click="validateVehicleForm">
				Save Changes
			</v-btn>
		<v-btn color="secondary" text @click="cancel">
			Cancel
		</v-btn>
	</v-card-actions>
</v-card>
</template>

<script>
import axios from "axios";

export default {
	name: 'EditVehicle',
	props: {
		vehicle: {
			type: Object,
			required: true
		}
	},
	data: () => ({
		vehicleProperties: null,
		fields: [],
		fieldRules: {},
		dateMenus: {},
		vehicleFormValid: true,
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
		save() {
			axios
        .put(`${this.$store.state.baseApiUrl}/vehicles/${this.vehicle._id}`, {
          properties: this.vehicleProperties
        })
        .then((response) => {
          this.$emit("vehicle-updated", response.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
		},
    cancelDate(key) {
      this.vehicleProperties[key].value = "";
      this.dateMenus[key] = false;
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
          let tempDateMenus = {};
          let tempFieldRules = {};
          response.data.payload.forEach((property) => {
            tempFields.push({
              label: property.label,
              input_type: property.input_type,
              key: property.key,
              required: property.required,
              options: property.options,
            });
            if (property.input_type == "Date") {
              tempDateMenus[property.key] = false;
            }
            if (property.required) {
              tempFieldRules[property.key] = [
                (v) => !!v || `${property.label} is required`,
              ];
            }
            if (property.input_type == "List") {
              this.$watch(`vehicleProperties.${property.key}.value`, (val, prev) => {
                if (!prev) return;
                if (val.length === prev.length) return;

                this.vehicleProperties[property.key].value = val.map((v) => {
                  return v;
                });
              });
            }
          });
          this.fields = tempFields;
          this.dateMenus = tempDateMenus;
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
		// prevent from two-binding with the parent component
		this.vehicleProperties = JSON.parse(JSON.stringify(this.vehicle.properties))
		this.fetchProperties();
	}
}
</script>

<style>

</style>