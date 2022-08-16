<template>
    <v-card max-width="300" elevation="3" class="ma-2">
      <v-img height="200" :src="require('@/assets/accent-background.jpg')">
      <v-toolbar flat color="rgba(0, 0, 0, 0)" absolute>
        <v-menu>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="white"
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-cog</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="setElapsedTime(30)">
              <v-list-item-title>
                30+ days
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="setElapsedTime(180)">
              <v-list-item-title>
                180+ days
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="setElapsedTime(365)">
              <v-list-item-title>
                365+ days
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
        <v-container fill-height>
          <v-col>
            <v-card-title class="mx-auto">
              <v-row justify="center" class="ma-0 text-h2 white--text" align="center">{{ count }}</v-row>
            </v-card-title>
            <v-card-subtitle class="mt-3">
              <v-row justify="center" class="text-button white--text" align="center">{{ elapsedTime }}+ days in inventory</v-row>
            </v-card-subtitle>
          </v-col>
        </v-container>
      </v-img>
    </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: 'InventoryTimeElapsedWidget',

  data: () => ({
    loading: true,
    elapsedTime: "30",
    count: null
  }),
  methods: {
    setElapsedTime(value) {
      this.elapsedTime = `${value}`;
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