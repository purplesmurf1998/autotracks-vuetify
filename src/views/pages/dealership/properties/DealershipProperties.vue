<template>
  <v-row justify="center">
    <v-card elevation="2" width="75%" class="ma-md-10">
      <v-card-title>
        <v-toolbar flat>
          <v-toolbar-title>Dealership Properties</v-toolbar-title>
          <v-spacer />
          <v-btn
            rounded
            color="accent"
            text
          >
            Modify property order
          </v-btn>
          <v-divider class="mx-4" inset vertical />
          <v-btn
            rounded
            color="primary"
            text
          >
            Add a vehicle property
          </v-btn>
          <!-- Delete dialog -->
          <v-dialog transition="dialog-bottom-transition" width="500" v-model="deleteDialog">
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
          <v-icon 
            small 
            class="mr-2" 
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon 
            small
            color="error" 
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-row>
</template>

<script>
import DeleteDialog from '../../../../components/DeleteDialog.vue'

export default {
  name: 'DealershipProperties',

  data: () => ({
    editedIndex: -1,
    deleteDialog: false,
    properties: [
      {
        _id: '3',
        label: 'Model #',
        inputType: 'Text',
        visible: true,
        required: true,
        options: [],
        position: 2
      },
      {
        _id: '1',
        label: 'Exterior Color',
        inputType: 'Text',
        visible: true,
        required: true,
        options: [],
        position: 3
      },
      {
        _id: '2',
        label: 'Interior Color',
        inputType: 'Text',
        visible: true,
        required: true,
        options: [],
        position: 4
      }
    ],
    headers: [
      {
        text: 'Index',
        value: 'position',
        align: 'center'
      },
      {
        text: 'Label',
        value: 'label',
        align: 'start'
      },
      {
        text: 'Input Type',
        value: 'inputType',
        align: 'start'
      },
      {
        text: 'Visible',
        value: 'visible',
        align: 'start'
      },
      {
        text: 'Required',
        value: 'required',
        align: 'start'
      },
      {
        text: 'Options',
        value: 'options',
        align: 'start'
      },
      {
        text: 'Actions',
        value: 'actions',
        sortable: false
      }
    ]
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
    }
  },
  components: {
    DeleteDialog
  }
}
</script>

<style>

</style>