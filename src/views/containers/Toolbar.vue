<template>
  <v-app-bar app color="white" fixed :elevation="0">
    <v-app-bar-nav-icon @click="$store.commit('toggleSidebar')" v-if="!$store.state.sidebarShow"></v-app-bar-nav-icon>
    <v-divider class="mx-4" inset vertical/>
    <v-btn color="primary" outlined rounded v-if="addVehicle">Add a vehicle</v-btn>
    <v-spacer />
    <v-menu offset-y bottom rounded min-width="100">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          rounded
          v-bind="attrs"
          v-on="on"
          small
        >
          Account
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item>
          <v-list-item-title>Account Details</v-list-item-title>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-divider class="mx-4" inset vertical/>
  </v-app-bar>
</template>

<script>
export default {
  name: 'Toolbar',

  data: () => ({
    items: [
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me' },
      { title: 'Click Me 2' },
    ],
  }),
  computed: {
    addVehicle() {
      return this.$route.matched.find(match => match.path == '/inventory');
    }
  },
  methods: {
    logout() {
      console.log("Logout");
    }
  }
}
</script>

<style>

</style>