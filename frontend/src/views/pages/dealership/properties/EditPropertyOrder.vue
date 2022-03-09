<template>
  <v-card>
    <v-card-title class="text-h6"> Update Property Order </v-card-title>
    <v-card-text>
      <v-list dense>
        <draggable
          v-model="properties"
          group="properties"
          @start="drag = true"
          @end="drag = false"
        >
          <v-list-item
            v-for="item in properties"
            :key="item._id"
            style="cursor: pointer"
            outline
          >
            <v-list-item-icon>
              <v-chip color="primary" small>{{ item.position }}</v-chip>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-text="item.label"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </draggable>
      </v-list>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="save" rounded> Save </v-btn>
      <v-btn color="secondary" text @click="cancel" rounded> Cancel </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
const axios = require("axios");
import draggable from "vuedraggable";

export default {
  name: "EditPropertyOrder",

  data: () => ({
    properties: [],
    drag: false,
  }),
  methods: {
    save() {
      axios
        .put(
          `${this.$store.state.baseApiUrl}/properties/positions`,
          {
            properties: this.properties,
          },
          {
            params: {
              dealership: this.$store.state.loggedInUser.dealership,
            },
          }
        )
        .then(() => {
          this.$emit("property-order-updated");
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancel() {
      this.$emit("cancel");
    },
    fetchProperties() {
      axios
        .get(`${this.$store.state.baseApiUrl}/properties`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
          },
        })
        .then((response) => {
          this.properties = response.data.payload;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.fetchProperties();
  },
  components: {
    draggable,
  },
};
</script>

<style>
</style>