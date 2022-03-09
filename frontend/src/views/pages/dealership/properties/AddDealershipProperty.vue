<template>
  <v-card>
    <v-card-title class="text-h6"> Creating Vehicle Property </v-card-title>
    <v-card-text>
      <v-text-field label="Label" outlined dense v-model="label" />
      <v-select
        :items="['Text', 'Number', 'Currency', 'Date', 'Dropdown', 'List']"
        outlined
        dense
        label="Input Type"
        v-model="inputType"
        :hide-details="inputType != 'Dropdown'"
      />
      <v-combobox
        v-model="model"
        :filter="filter"
        :hide-no-data="!search"
        :items="items"
        :search-input.sync="search"
        hide-selected
        label="Options"
        outlined
        hide-details
        dense
        multiple
        small-chips
        v-if="inputType == 'Dropdown'"
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
            v-if="item === Object(item)"
            v-bind="attrs"
            :color="item.color"
            :input-value="selected"
            label
            small
          >
            <span class="pr-2">
              {{ item.text }}
            </span>
            <v-icon small @click="parent.selectItem(item)"> $delete </v-icon>
          </v-chip>
        </template>
        <template v-slot:item="{ index, item }">
          <v-text-field
            v-if="editing === item"
            v-model="editing.text"
            autofocus
            flat
            background-color="transparent"
            hide-details
            solo
            @keyup.enter="edit(index, item)"
          ></v-text-field>
          <v-chip v-else :color="item.color" dark label small>
            {{ item.text }}
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
      <v-checkbox
        label="Property visible in the inventory"
        v-model="visible"
        hide-details
      />
      <v-checkbox label="A value is required" v-model="required" />
      <v-textarea
        label="Description (optional)"
        outlined
        dense
        rows="5"
        hide-details
      />
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="create" rounded> Create </v-btn>
      <v-btn color="secondary" text @click="cancel" rounded> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const axios = require("axios");

export default {
  name: "AddDealershipProperty",

  data: () => ({
    label: "",
    inputType: "",
    options: "",
    visible: true,
    required: true,
    description: "",

    activator: null,
    attach: null,
    colors: ["green", "purple", "indigo", "cyan", "teal", "orange"],
    editing: null,
    editingIndex: -1,
    items: [
      { header: "Start typing in the field to create a dropdown option" },
    ],
    nonce: 1,
    menu: false,
    model: [],
    x: 0,
    search: null,
    y: 0,
  }),
  methods: {
    create() {
      let property = {
        dealership: this.$store.state.loggedInUser.dealership,
        label: this.label,
        input_type: this.inputType,
        options: [],
        visible: this.visible,
        required: this.required,
        description: this.description,
      };

      if (this.inputType == "Dropdown") {
        this.model.forEach((option) => {
          property.options.push(option.text);
        });
      }

      axios
        .post(`${this.$store.state.baseApiUrl}/properties`, property)
        .then((response) => {
          this.$emit("property-created", response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("cancel");
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
  watch: {
    model(val, prev) {
      if (val.length === prev.length) return;

      this.model = val.map((v) => {
        if (typeof v === "string") {
          v = {
            text: v,
            color: "primary",
          };

          // this.items.push(v);

          this.nonce++;
        }

        return v;
      });
    },
  },
};
</script>

<style>
</style>