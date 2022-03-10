<template>
  <div>
    <v-card height="100%" class="mx-auto rounded-0" flat dark>
      <v-navigation-drawer app floating v-model="$store.state.sidebarShow">
        <v-list-item class="pt-5 pb-5">
          <v-list-item-content>
            <v-list-item-title class="text-h6 d-flex justify-center">
              Autotracks
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list dense nav>
          <v-list-item-group
            v-model="active"
            active-class="bg-active"
            color="indigo"
          >
            <v-list-item
              v-for="(item, index) in sidebarItems"
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
import IntroductionOne from "../../components/IntroductionOne.vue";

export default {
  name: "Sidebar",

  data: () => ({
    active: 1,
    sidebarItems: [
      {
        title: "Dashboard",
        to: "/dashboard",
        icon: "mdi-view-dashboard",
        badge: null,
      },
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
        title: "Accounts",
        to: "/accounts",
        icon: "mdi-account",
        badge: "New!",
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
  }),
  components: {
    IntroductionOne,
  },
};
</script>

<style>
.bg-active {
  background-color: rgb(255, 87, 34) !important;
  color: white !important;
}
</style>