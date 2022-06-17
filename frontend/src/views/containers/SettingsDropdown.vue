<template>
  <v-card>
    <!-- <v-card-title class="text-md-body-1 d-flex justify-center">
      Settings
    </v-card-title> -->
    <v-list dense>
      <v-list-item-group color="primary">
        <v-list-item>
          <v-list-item-icon>
            <v-icon v-text="'mdi-account'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Account Settings'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="logout">
          <v-list-item-icon>
            <v-icon v-text="'mdi-logout'"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="'Logout'"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: "SettingsDropdown",

  data: () => ({
    //
  }),
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style>
</style>