<template>
  <v-app-bar app color="grey lighten-4" fixed :elevation="0" id="app-bar">
    <v-app-bar-nav-icon
      @click="$store.commit('toggleSidebar')"
    ></v-app-bar-nav-icon>
    <v-spacer />
    <v-menu offset-y left bottom rounded min-width="100">
      <template v-slot:activator="{ on, attrs }">
        <v-badge
          :value="notificationBadge"
          color="primary"
          content="3"
          right
          class="mr-5"
          overlap
        >
          <v-icon v-bind="attrs" v-on="on" @click="notificationBadge = false"> mdi-bell </v-icon> 
        </v-badge>
      </template>
      <notifications-dropdown />
    </v-menu>
    <v-menu offset-y left bottom rounded min-width="100">
      <template v-slot:activator="{ on, attrs }">
        <v-btn text rounded v-bind="attrs" v-on="on" small> Account </v-btn>
      </template>
      <settings-dropdown />
    </v-menu>
  </v-app-bar>
</template>

<script>
import SettingsDropdown from './SettingsDropdown.vue'
import NotificationsDropdown from './NotificationsDropdown.vue'

export default {
  name: "Toolbar",

  data: () => ({
    notificationBadge: true
  }),
  components: {
    SettingsDropdown,
    NotificationsDropdown
  }
};
</script>

<style>
</style>