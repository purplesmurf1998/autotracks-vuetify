<template>
  <v-card>
    <v-card-title class="text-h6"> Edit Table Columns </v-card-title>
    <v-card-text>
      <p>
        Select and drag the columns to change their order in the inventory
        table. Selecting the checkbox will make a column visible/invisible.
      </p>
      <v-divider />
      <v-list dense rounded>
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
          >
            <v-list-item-icon>
              <v-checkbox
                v-model="item.visible"
                hide-details
                class="ma-0 pa-0"
              />
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                v-text="item.property.label"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </draggable>
      </v-list>
      <v-divider class="mt-3 mb-5"/>
      <p>
        Select a property you wish to set to group the inventory.
      </p>
      <v-combobox 
        :items="groupByItems" 
        v-model="groupBy"
        dense 
        outlined 
        label="Group By"
        clearable
      />
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="save"> Save </v-btn>
      <v-btn color="secondary" text @click="cancel"> Cancel </v-btn>
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
    groupByItems: [],
    groupBy: null,
    propertyOrderId: null,
    groupByProperty: null,
    drag: false,
  }),
  methods: {
    save() {
      axios
        .put(
          `${this.$store.state.baseApiUrl}/properties/order/${this.propertyOrderId}`,
          {
            order: this.properties,
            group_by: this.groupBy
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
        .get(`${this.$store.state.baseApiUrl}/properties/order`, {
          params: {
            dealership: this.$store.state.loggedInUser.dealership,
            user: this.$store.state.loggedInUser._id,
          },
        })
        .then((response) => {
          this.properties = response.data.payload.order;
          this.propertyOrderId = response.data.payload._id;
          this.groupBy = response.data.payload.group_by;

          let tempGroupByItems = this.properties.map(prop => {
            return { value: prop.property.key, text: prop.property.label }
          })

          this.groupByItems = tempGroupByItems;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  watch: {
    groupBy(newVal, prevVal) {
      console.log(newVal);
      console.log(prevVal);
    }
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