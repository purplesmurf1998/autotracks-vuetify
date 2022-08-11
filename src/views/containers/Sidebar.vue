<template>
  <div>
    <v-card height="100%" class="mx-auto rounded-0" flat dark>
      <v-navigation-drawer app floating v-model="$store.state.sidebarShow">
        <v-list-item class="pt-5 pb-5">
          <v-list-item-content>
            <v-list-item-title class="text-h6 d-flex justify-center">
              Autotracks
            </v-list-item-title>
            <v-list-item-subtitle class="d-flex justify-center align-center">
              {{ activeDealershipName }}
              <v-menu offset-x nudge-right="8">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon x-small class="ml-2">
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list dense light width="230" nav>
                  <v-list-item-group :value="activeDealershipId">
                    <v-list-item
                      v-for="dealership in dealerships"
                      :key="dealership._id"
                      :value="dealership._id"
                      color="primary"
                      @click="selectDealership(dealership._id)"
                    >
                      <v-list-item-title>{{
                        dealership.name
                      }}</v-list-item-title>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-menu>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list dense nav>
          <v-list-item-group
            v-model="active"
            active-class="bg-active"
            color="indigo"
          >
            <v-list-item
              v-for="(item, index) in sideBarItems"
              :key="index"
              :to="item.to"
            >
              <v-list-item-icon class="mr-0">
                <v-icon dark>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  class="pl-6"
                  v-text="item.title"
                ></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action v-if="item.badge">
                <v-chip v-text="item.badge" x-small color="primary"></v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </v-card>
    <introduction-one :value="false" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import IntroductionOne from "../../components/IntroductionOne.vue";
import DealershipService from "../../services/dealershipService";

export default {
  name: "Sidebar",

  data: () => ({
    active: 1,
    defaultSideBarItems: [
      {
        title: "Inventory",
        to: "/inventory",
        icon: "mdi-car",
        badge: null,
      },
      {
        title: "Dealership",
        to: "/dealership",
        icon: "mdi-cog",
        badge: null,
      },
      {
        title: "Users",
        to: "/users",
        icon: "mdi-account",
        badge: null,
      },
      {
        title: "Properties",
        to: "/properties",
        icon: "mdi-car-cog",
        badge: null,
      },
      {
        title: "Zones",
        to: "/zones",
        icon: "mdi-map-marker",
        badge: null,
      },
      {
        title: "Roles",
        to: "/roles",
        icon: "mdi-account-cog",
        badge: null,
      },
    ],
    dealerships: [],
  }),
  components: {
    IntroductionOne,
  },
  computed: {
    ...mapGetters(["activeDealershipId", "activeDealershipName", "accountId"]),
    sideBarItems() {
      if (!this.activeDealershipId) {
        return [
          {
            title: "Dashboard",
            to: "/dashboard",
            icon: "mdi-view-dashboard",
            badge: null,
          },
          {
            title: "Dealership",
            to: "/dealership",
            icon: "mdi-cog",
            badge: "New !",
          },
        ];
      } else {
        return this.defaultSideBarItems;
      }
    },
    dealershipItems() {
      return this.dealerships.filter(
        (item) => item._id !== this.activeDealershipId
      );
    },
  },
  methods: {
    ...mapMutations(["setUser"]),
    selectDealership(dealershipId) {
      DealershipService.activateDealership(this.accountId, dealershipId)
        .then(() => {
          this.$router.go();
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    handleDealershipsResponse(httpResponse) {
      this.dealerships = httpResponse.data;
    },
    handleDealershipsHttpError(error) {
      console.log(error);
    },
    loadDealerships() {
      DealershipService.getDealerships(this.accountId)
        .then((httpResponse) => this.handleDealershipsResponse(httpResponse))
        .catch((error) => this.handleDealershipsHttpError(error));
    },
  },
  mounted() {
    this.loadDealerships();
  },
};
</script>

<style>
.bg-active {
  background-color: rgb(255, 87, 34) !important;
  color: white !important;
}
</style>
