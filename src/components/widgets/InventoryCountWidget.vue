<template>
  <v-hover v-slot="{ hover }">
    <v-card max-width="300" elevation="3" class="ma-2">
      <v-img height="200" :src="require('@/assets/primary-background.jpg')">
        <v-expand-transition>
          <div
            v-if="hover"
            class="d-flex transition-fast-in-fast-out v-card--reveal align-items-center"
            style="height: 100%;"
          >
            <v-btn color="primary" class="mx-auto my-auto" @click="goToInventory">View Inventory</v-btn>
          </div>
        </v-expand-transition>
        <v-container fill-height>
          <v-col>
            <v-card-title class="mx-auto">
              <v-row justify="center" class="ma-0 text-h2 white--text" align="center">{{ count }}</v-row>
            </v-card-title>
            <v-card-subtitle class="mt-3">
              <v-row justify="center" class="text-button white--text" align="center">Vehicle(s) in inventory</v-row>
            </v-card-subtitle>
          </v-col>
        </v-container>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
import axios from "axios";

export default {
  name: 'InventoryCountWidget',

  data: () => ({
    loading: true,
    count: null
  }),
  methods: {
    goToInventory() {
      this.$router.push("/inventory");
    },
    fetchInventoryCount() {
      axios
        .get(`${this.$store.state.baseApiUrl}/vehicles`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
          },
          headers: {
            'Authorization': `Bearer ${this.$store.state.token}`
          }
        })
        .then((response) => {
          this.count = response.data.payload.length;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.fetchInventoryCount();
  }
}
</script>

<style>
</style>