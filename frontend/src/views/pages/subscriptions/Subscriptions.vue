<template>
  <div style="height: 100%">
    <v-card flat style="height: 100%">
      <v-toolbar
        color="grey lighten-4"
        extension-height="50"
        extended
        flat
        class="top-toolbar"
      >
        <v-toolbar-title>Subscriptions</v-toolbar-title>
        <v-spacer />
        <v-btn
          color="primary"
          v-if="!$vuetify.breakpoint.mobile"
          @click="addingSubscription = true"
        >
          <v-icon left dark class="mr-2"> mdi-plus </v-icon>
          Add Subscription
        </v-btn>
        <v-menu bottom left v-if="$vuetify.breakpoint.mobile">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>mdi-view-headline</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn color="primary" text small @click="addingSubscription = true">
                <v-icon left dark class="mr-2"> mdi-plus </v-icon>
                Add Subscription
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-card width="90%" class="mx-auto">
        <v-data-table
          dense
          :headers="headers"
          :items="items"
          class="row-pointer"
        >
        </v-data-table>
      </v-card>
    </v-card>
    <v-dialog max-width="500" v-model="addingSubscription">
      <add-subscription
        v-if="addingSubscription"
        @cancel="addingSubscription = false"
        @subscription-added="subscriptionAdded"
      />
    </v-dialog>
  </div>
</template>

<script>
const axios = require("axios");
import AddSubscription from "./AddSubscription.vue";

export default {
  name: "Subscriptions",

  data: () => ({
    addingSubscription: false,
    headers: [
        {
            text: "Event Type",
            value: "event type",
        },
        {
            text: "Property",
            value: "property",
        },
        {
            text: "Value",
            value: "value",
        },
        {
            text: "Status",
            value: "status",
        },
    ],
    items: [ 
        {
            "event type": "Value",
            property: "test",
            value: "value1",
            status: "Enabled"
        },
        {
            text: "Value",
            value: "value2",
        },
        {
            text: "Value",
            value: "value3",
        },
        {
            text: "Value",
            value: "value4",
        },
    ],
  }),
  methods: {
    subscriptionAdded() {
      this.addingSubscription = false;
      this.fetchSubscriptions();
    },
    fetchSubscriptions() {
      axios
        .get(`${this.$store.state.baseApiUrl}/subscriptions`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
          },
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
            console.log(response.data.payload);
        })
        .catch((error) => {
            console.log(error);
        });
    },
  },
  mounted() {
    this.fetchSubscriptions();
  },
  components: {
    AddSubscription,
  },
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}

.v-data-table {
  overflow: hidden !important;
  white-space: nowrap;
}
</style>