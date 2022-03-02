<template>
  <router-view />
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  }),
  beforeCreate() {
    // this.$store.dispatch("verify");
  },
};
</script>
