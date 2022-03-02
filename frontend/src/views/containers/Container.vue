<template>
  <div class="app">
    <v-app>
      <v-main>
        <toolbar />
        <sidebar />
        <router-view :key="$route.path" />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
import Toolbar from "./Toolbar.vue";

export default {
  name: "Container",
  components: {
    Sidebar,
    Toolbar,
  },
};
</script>

<style>
</style>