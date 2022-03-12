<template>
  <div>
    <v-alert
      :color="messageType"
      v-if="message"
      text
      outlined
      dense
      class="mx-auto mt-4 mb-0"
      style="width: 90%"
      >{{ message }}</v-alert
    >
    <v-card width="90%" class="mx-auto mt-5">
      <v-data-table
        :headers="headers"
        :items="properties"
        :items-per-page="10"
        :options="{ sortBy: ['position'] }"
        :search="propertySearch"
        class="mb-5"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small color="error" @click="deleteItem(item)">
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:[`item.required`]="{ item }">
          <v-chip color="primary" v-if="item.required" small>Required</v-chip>
          <v-chip color="secondary" v-if="!item.required" small
            >Optional</v-chip
          >
        </template>
      </v-data-table>
    </v-card>
    <v-dialog max-width="500" v-model="editingProperty">
      <edit-property
        v-if="editingProperty"
        :property="editProperty"
        @cancel="editingProperty = false"
        @property-updated="propertyUpdated"
      />
    </v-dialog>
    <v-dialog
      transition="dialog-bottom-transition"
      width="500"
      v-model="deleteDialog"
    >
      <delete-dialog
        dialogContent="Are you certain you want to delete this vehicle property?"
        v-on:confirm="confirmDeleteItem"
        v-on:cancel="deleteDialog = false"
      ></delete-dialog>
    </v-dialog>
  </div>
</template>

<script>
const axios = require("axios");

import DeleteDialog from "../../../components/DeleteDialog.vue";
import EditProperty from "./EditProperty.vue";

export default {
  name: "PropertiesTable",
  props: {
    propertySearch: {
      type: String,
    },
  },
  data: () => ({
    editedIndex: -1,
    deleteDialog: false,
    deleteItemId: null,
    editProperty: null,
    editingProperty: false,
    messageType: null,
    message: null,
    properties: [],
    headers: [
      {
        text: "Label",
        value: "label",
        align: "start",
      },
      {
        text: "Input Type",
        value: "input_type",
        align: "start",
      },
      {
        text: "Required",
        value: "required",
        align: "start",
      },
      {
        text: "Options",
        value: "options",
        align: "start",
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false,
      },
    ],
  }),
  methods: {
    propertyUpdated() {
      this.editingProperty = false;
      this.editProperty = null;
      this.showMessage("success", "Vehicle property updated successfully.");
      this.fetchProperties();
    },
    editItem(item) {
      this.editProperty = item;
      this.editingProperty = true;
    },
    deleteItem(item) {
      this.deleteItemId = item._id;
      this.editedIndex = this.properties.indexOf(item);
      this.deleteDialog = true;
    },
    showMessage(type, message) {
      this.messageType = type;
      this.message = message;
      setTimeout(() => {
        this.message = null;
        this.messageType = null;
      }, 4000);
    },
    confirmDeleteItem() {
      axios
        .delete(
          `${this.$store.state.baseApiUrl}/properties/${this.deleteItemId}`
        )
        .then(() => {
          this.fetchProperties();
          this.editedIndex = -1;
          this.deleteItemId = null;
          this.deleteDialog = false;
          this.showMessage("success", "Vehicle property deleted successfully.");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchProperties() {
      axios
        .get(`${this.$store.state.baseApiUrl}/properties`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
          },
        })
        .then((response) => {
          this.properties = response.data.payload;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchProperties();
  },
  components: {
    DeleteDialog,
    EditProperty,
  },
};
</script>

<style>
</style>