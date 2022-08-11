<template>
  <v-container fluid class="mx-auto">
    <v-row align="center" justify="start" class="ma-0">
      <!-- <inventory-count-widget />
      <inventory-time-elapsed-widget /> -->
    </v-row>
  </v-container>
</template>

<script>
// import InventoryCountWidget from "../components/widgets/InventoryCountWidget.vue"
// import InventoryTimeElapsedWidget from "../components/widgets/InventoryTimeElapsedWidget.vue";

export default {
  name: "Dashboard",

  data: () => ({
    firstIntro: true,
  }),
  components: {
    // InventoryCountWidget,
    // InventoryTimeElapsedWidget
  },
};
</script>

<style></style>
