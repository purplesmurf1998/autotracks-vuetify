<template>
  <v-app-bar app color="grey lighten-4" fixed :elevation="0" id="app-bar">
    <v-app-bar-nav-icon
      @click="$store.commit('toggleSidebar')"
      v-if="!$store.state.sidebarShow"
    ></v-app-bar-nav-icon>
    <v-spacer />
    <v-menu offset-y left bottom rounded min-width="100">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text rounded v-bind="attrs" v-on="on" small> Account </v-btn>
      </template>
      <v-card>
        <v-card-title
          class="text-md-body-1 d-flex justify-center primary white--text"
        >
          Settings
        </v-card-title>
        <v-card-text>
          <v-list dense rounded>
            <v-list-item class="text-center text-sm-body-2" dense>
              <v-list-item-title>Account Details</v-list-item-title>
            </v-list-item>
            <v-list-item
              @click="logout"
              class="text-center text-sm-body-2"
              dense
            >
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>
    <!-- <v-divider class="mx-4" inset vertical /> -->
  </v-app-bar>
</template>

<script>
export default {
  name: "Toolbar",

  data: () => ({
    //
  }),
  methods: {
    logout() {
      console.log("Logout");
    },
  },
};
</script>

<style>
</style>