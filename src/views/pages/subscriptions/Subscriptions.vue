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
      <v-card width="90%" class="mx-auto" style="margin-top: 49px">
        <v-data-table
          dense
          :headers="headers"
          :items="items"
          class="row-pointer"
        >
        <template slot="item.status" slot-scope="{ item }">
            <v-switch v-model="item.status" @click="toggleStatus(item._id, item.status)"></v-switch>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon color="error" @click="deletingSubscriptionModal(item._id)">
            mdi-delete
          </v-icon>
        </template>
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
    <v-dialog max-width="500" v-model="deletingSubscription">
      <v-card>
    <v-card-title class="text-h6"> Deleting Subscription </v-card-title>
    <v-card-text>
      <h3>Are you sure you want to delete this subscription? </h3>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="error" @click="deleteSubscription"> Delete </v-btn>
      <v-btn dense outlined text @click="deletingSubscription = false"> Cancel </v-btn>
    </v-card-actions>
  </v-card>
    </v-dialog>
  </div>
</template>

<script>
import AddSubscription from "./AddSubscription.vue";
import SubscriptionService from "../../../services/subscriptionService";
import { mapGetters } from "vuex";

export default {
  name: "Subscriptions",
  data: () => ({
    deletingSubscription: false,
    addingSubscription: false,
    subscriptionID: null,
    headers: [
        {
            text: "Event Type",
            value: "event_type",
        },
        {
            text: "Property",
            value: "property",
        },
        {
            text: "Values",
            value: "values",
        },
        {
            text: "Status",
            value: "status",
        },
        {
            text: "Actions",
            value: "actions",
            align: "start"
        },
    ],
    items: [],
    status: false,
  }),
  methods: {
    subscriptionAdded() {
      this.addingSubscription = false;
      this.fetchSubscriptions();
    },
    deletingSubscriptionModal(subscriptionID) {
        this.subscriptionID = subscriptionID;
        this.deletingSubscription = true;
    },
    deleteSubscription() {
      if (this.subscriptionID) {
          SubscriptionService.deleteSubscription(this.activeDealershipId, this.subscriptionID)
          .then(() => {
              this.deletingSubscription = false;
              this.fetchSubscriptions();
          })
          .catch((error) => {
              console.log(error);
          });
      }
      else
          console.log("Subscription ID is undefined");
    },
    toggleStatus(subscriptionID, subscriptionStatus) {
        let subscription_object = { 
          status: subscriptionStatus ? 'Enabled' : 'Disabled'
        }
        SubscriptionService.updateSubscription(this.activeDealershipId, subscriptionID, subscription_object)
        .then(() => {
            this.fetchSubscriptions();
        })
        .catch((error) => {
            console.log(error);
        });
    },
    fetchSubscriptions() {
        let tempSubs = [];
        SubscriptionService.getSubscriptions(this.activeDealershipId)
        .then((response) => {
            response.data.payload.forEach(sub => {
                let tempSubObj = {};
                tempSubObj._id = sub._id;
                tempSubObj.event_type = sub.event_type;
                tempSubObj.property = sub.property;
                if (sub.select_all)
                    tempSubObj.values = 'All';
                else if (sub.values.length > 5) { //Displaying only the first 5 values
                    sub.values.splice(5, sub.values.length - 5);
                    tempSubObj.values = sub.values.join(', ') + ', etc..';
                }
                else
                    tempSubObj.values = sub.values;
                tempSubObj.status = sub.status === 'Enabled' ? true : false;
                tempSubs.push(tempSubObj);       
            });
            this.items = tempSubs;
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
  computed: {
    ...mapGetters(["activeDealershipId"]),
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