<template>
  <v-card width="90%" class="mx-auto mt-5">
    <v-card-title>
      <v-toolbar flat>
        <v-toolbar-title>Dealership Properties</v-toolbar-title>
        <!-- Delete dialog -->
        <v-dialog
          transition="dialog-bottom-transition"
          width="500"
          v-model="deleteDialog"
        >
          <delete-dialog
            dialogContent="Are you certain you want to delete this vehicle property?"
            v-on:confirm="deleteDialog = false"
            v-on:cancel="deleteDialog = false"
          ></delete-dialog>
        </v-dialog>
      </v-toolbar>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="properties"
      :items-per-page="10"
      :options="{ sortBy: ['position'] }"
    >
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)" v-if="item.editable">
          mdi-pencil
        </v-icon>
        <v-icon
          small
          color="error"
          @click="deleteItem(item)"
          v-if="item.removable"
        >
          mdi-delete
        </v-icon>
      </template>
      <template v-slot:[`item.visible`]="{ item }">
        <v-chip color="primary" v-if="item.visible" small>Visible</v-chip>
        <v-chip color="secondary" v-if="!item.visible" small>Hidden</v-chip>
      </template>
      <template v-slot:[`item.required`]="{ item }">
        <v-chip color="primary" v-if="item.required" small>Required</v-chip>
        <v-chip color="secondary" v-if="!item.required" small>Optional</v-chip>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import DeleteDialog from "../../../../components/DeleteDialog.vue";

export default {
  name: "DealershipProperties",

  data: () => ({
    editedIndex: -1,
    deleteDialog: false,
    properties: [
      {
        _id: "3",
        label: "Model #",
        text: "model-#",
        inputType: "Text",
        visible: true,
        required: true,
        options: [],
        position: 2,
        removable: true,
        editable: true,
      },
      {
        _id: "1",
        label: "Exterior Color",
        text: "exterior-color",
        inputType: "Text",
        visible: true,
        required: true,
        options: [],
        position: 3,
        removable: true,
        editable: true,
      },
      {
        _id: "2",
        label: "Interior Color",
        text: "interior-color",
        inputType: "Text",
        visible: true,
        required: true,
        options: [],
        position: 4,
        removable: true,
        editable: true,
      },
      {
        _id: "3",
        label: "On Road Since",
        text: "on-road-since",
        inputType: "Date",
        visible: false,
        required: false,
        options: [],
        position: 5,
        removable: false,
        editable: true,
      },
    ],
    headers: [
      {
        text: "Index",
        value: "position",
        align: "center",
      },
      {
        text: "Label",
        value: "label",
        align: "start",
      },
      {
        text: "Input Type",
        value: "inputType",
        align: "start",
      },
      {
        text: "Visible",
        value: "visible",
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
    editItem(item) {
      console.log(item);
    },
    deleteItem(item) {
      this.editedIndex = this.properties.indexOf(item);
      this.deleteDialog = true;
    },
    confirmDeleteItem() {
      this.deleteDialog = false;
    },
  },
  components: {
    DeleteDialog,
  },
};
</script>

<style>
</style>