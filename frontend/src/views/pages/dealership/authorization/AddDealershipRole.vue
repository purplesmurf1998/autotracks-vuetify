<template>
  <v-card>
    <div v-if="roleCount < 5">
      <v-card-title class="text-h6"> Creating Role Profile </v-card-title>
      <v-card-text>
        <v-text-field label="Role Title" outlined dense v-model="title" />
        <v-combobox
          multiple
          :items="items"
          outlined
          dense
          label="Permissions"
          hide-details
          :search-input.sync="roleSearch"
          v-model="permissions"
        />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="create" rounded> Create </v-btn>
        <v-btn color="secondary" text @click="cancel" rounded> Cancel </v-btn>
      </v-card-actions>
    </div>
    <div v-else>
      <v-card-title class="text-h6"> Creating Role Profile </v-card-title>
      <v-card-text>
        <p>
          You are unable to add more roles to this dealership as you have
          reached the maximum amount allowed.
        </p>
        <p>
          <a href="#">Upgrade</a> your account plan in order to create
          additional roles.
        </p>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn color="primary" text rounded @click="cancel">OK</v-btn>
      </v-card-actions>
    </div>
  </v-card>
</template>

<script>
const axios = require("axios");

export default {
  name: "AddDealershipRole",
  props: {
    roleCount: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    title: "",
    permissions: [],
    items: [
      "create_vehicle",
      "update_vehicle",
      "read_vehicle",
      "delete_vehicle",
      "create_location",
      "update_location",
      "read_location",
      "delete_location",
      "create_account",
      "update_account",
      "read_account",
      "delete_account",
      "update_dealership",
      "read_dealership",
      "create_vehicle_list",
      "update_vehicle_list",
      "read_vehicle_list",
      "delete_vehicle_list",
      "create_vehicle_sale",
      "update_vehicle_sale",
      "read_vehicle_sale",
      "delete_vehicle_sale",
      "create_vehicle_property",
      "update_vehicle_property",
      "read_vehicle_property",
      "delete_vehicle_property",
    ],
    roleSearch: "",
    loading: false,
  }),
  methods: {
    create() {
      console.log(this.permissions);

      axios
        .post(`${this.$store.state.baseApiUrl}/roles`, {
          dealership: this.$store.state.loggedInUser.dealership,
          title: this.title,
          permissions: this.permissions,
        })
        .then((response) => {
          this.$emit("role-created", response.data.payload);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>

<style>
</style>