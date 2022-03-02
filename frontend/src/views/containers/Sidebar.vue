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

        <v-list dense nav rounded>
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
              <v-list-item-content>
                <v-list-item-title
                  class="pl-6"
                  v-text="item.title"
                ></v-list-item-title>
              </v-list-item-content>
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
        badge: null,
      },
      {
        title: "Dealership",
        to: "/dealership",
        badge: true,
      },
      {
        title: "Inventory",
        to: "/inventory",
        badge: null,
      },
      {
        title: "Clients",
        to: "/clients",
        badge: null,
      },
      {
        title: "Transactions",
        to: "/transactions",
        badge: null,
      },
      {
        title: "Lists",
        to: "/lists",
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