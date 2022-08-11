<template>
  <v-snackbar
    absolute
    bottom
    right
    text
    :value="show"
    color="primary"
    :timeout="-1"
  >
    <p class="text-h6">Welcome to Autotracks!</p>
    <p>
      You've successfully created your first dealership, now you're ready to
      create staff accounts to help you out!
    </p>
    <p>
      Head over to the
      <router-link to="/dealership"><strong>Dealership</strong></router-link>
      section to learn more.
    </p>
    <template v-slot:action="{ attrs }">
      <v-btn color="primary" text v-bind="attrs" @click="show = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "Snackbar",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    show: false,
  }),
  mounted() {
    this.show = this.value;
  },
};
</script>

<style>
</style>