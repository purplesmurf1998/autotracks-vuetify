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
      <v-checkbox label="A value is required" v-model="required" />
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="save"> Save </v-btn>
      <v-btn color="secondary" text @click="cancel"> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import DealershipService from "../../../services/dealershipService";
import { mapGetters } from "vuex";

export default {
  name: "EditDealershipProperty",
  props: {
    property: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    label: "",
    inputType: "",
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
  computed: {
    ...mapGetters(["activeDealershipId"]),
  },
  methods: {
    save() {
      let updatedProperty = {
        label: this.label,
        input_type: this.inputType,
        is_required: this.required,
        dropdown_options: [],
      };

      if (this.inputType == "Dropdown") {
        this.model.forEach((option) => {
          updatedProperty.dropdown_options.push(option.text);
        });
      }

      DealershipService.updateProperty(
        this.activeDealershipId,
        this.property._id,
        updatedProperty
      )
        .then(() => {
          this.$emit("property-updated");
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
  mounted() {
    this.label = this.property.label;
    this.inputType = this.property.input_type;
    this.required = this.property.is_required;

    if (this.property.input_type == "Dropdown") {
      let tempModel = [];
      this.property.dropdown_options.forEach((option) => {
        tempModel.push({
          text: option,
          color: "primary",
        });
      });
      this.model = tempModel;
    }
  },
};
</script>

<style></style>
