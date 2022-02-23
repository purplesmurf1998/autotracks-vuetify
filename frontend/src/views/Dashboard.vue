<template>
  <div>
    <v-snackbar
      absolute
      top
      center
      text
      :value="firstIntro"
      color="primary"
      :timeout="-1"
    >
      <p class="text-h6">Welcome to Autotracks!</p>
      <p>You've successfully created your first dealership, now you're ready to create staff accounts to help you out!</p>
      <p>Head over to the <router-link to="/dealership"><strong>Dealership</strong></router-link> section to learn more.</p>
      <template v-slot:action="{ attrs }">
        <v-btn
          color="primary"
          text
          v-bind="attrs"
          @click="firstIntro = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',

  data: () => ({
    firstIntro: true
  }),
}
</script>

<style>

</style>