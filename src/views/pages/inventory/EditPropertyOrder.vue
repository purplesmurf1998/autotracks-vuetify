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
                v-text="item.property_id.label"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </draggable>
      </v-list>
      <v-divider class="mt-3 mb-5" />
      <p>Select a property you wish to set to group the inventory.</p>
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
import InventoryService from "../../../services/inventoryService";
import { mapGetters } from "vuex";
import draggable from "vuedraggable";

export default {
  name: "EditPropertyOrder",

  data: () => ({
    properties: [],
    groupByItems: [],
    groupBy: null,
    propertyOrderId: null,
    drag: false,
  }),
  computed: {
    ...mapGetters(["activeDealershipId"]),
  },
  methods: {
    save() {
      // axios
      //   .put(
      //     `${this.$store.state.baseApiUrl}/dealerships/${this.$store.state.activeDealershipId}/property-configs/${this.propertyOrderId}`,
      //     {
      //       property_order: this.properties,
      //       property_group_by_ids: this.groupBy,
      //     },
      //     {
      //       headers: {
      //         Authorization: `Bearer ${this.$store.state.token}`,
      //       },
      //     }
      //   )
      InventoryService.updateHeaders(
        this.activeDealershipId,
        this.propertyOrderId,
        {
          property_order: this.properties,
          property_group_by_ids: this.groupBy,
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
      InventoryService.getHeaders(this.activeDealershipId)
        .then((response) => {
          this.properties = response.data.property_order;
          this.propertyOrderId = response.data._id;
          this.groupBy = response.data.property_group_by_ids
            ? {
                value: response.data.property_group_by_ids.value,
                text: response.data.property_group_by_ids.text,
              }
            : null;

          let tempGroupByItems = this.properties.map((prop) => {
            return {
              value: prop.property_id.key,
              text: prop.property_id.label,
            };
          });

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

<style></style>
