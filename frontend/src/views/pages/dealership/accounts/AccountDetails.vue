<template>
  <v-container fluid class="pa-5">
    <h4>Account details</h4>
    <p>{{ account.firstName }} {{ account.lastName }}</p>
    <v-row>
      <!-- Edit dialog -->
      <v-dialog transition="dialog-bottom-transition" width="500" v-model="editDialog" persistent>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text rounded color="primary" small v-bind="attrs" v-on="on">Edit details</v-btn>
        </template>
        <edit-account-details 
          :account="account"
          v-on:close="editDialog = false"
        />
      </v-dialog>
      <!-- Delete dialog -->
      <v-dialog transition="dialog-bottom-transition" width="500" v-model="deleteDialog">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text rounded color="error" small v-bind="attrs" v-on="on">Delete account</v-btn>
        </template>
        <delete-dialog 
          dialogContent="Are you certain you want to delete this staff account?" 
          v-on:confirm="deleteDialog = false" 
          v-on:cancel="deleteDialog = false"
        ></delete-dialog>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
import DeleteDialog from '../../../../components/DeleteDialog.vue';
import EditAccountDetails from './EditAccountDetails.vue';

export default {
  name: 'AccountDetails',
  props: {
    account: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    deleteDialog: false,
    editDialog: false
  }),
  methods: {
    deleteAccount() {
      //TODO: Delete the account and close the dialog
      this.deleteDialog = false;
    }
  },
  components: {
    DeleteDialog,
    EditAccountDetails
  },
  mounted() {
    console.log(this.account);
  }
}
</script>

<style>

</style>