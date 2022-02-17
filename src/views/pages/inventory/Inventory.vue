<template>
  <div>
    <v-card flat>
      <v-toolbar
        color="grey lighten-4"
        extension-height="50"
        extended
        flat
        class="top-toolbar"
      >
        <v-toolbar-title>Vehicles</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" text rounded small v-if="!$vuetify.breakpoint.mobile">
          <v-icon left dark class="mr-2"> mdi-table-column </v-icon>
          Edit Columns
        </v-btn>
        <v-btn color="primary" text rounded small v-if="!$vuetify.breakpoint.mobile">
          <v-icon left dark class="mr-2"> mdi-plus </v-icon>
          Add Vehicle
        </v-btn>
        <v-btn color="primary" text rounded small v-if="!$vuetify.breakpoint.mobile">
          <v-icon left dark> mdi-download-outline </v-icon>
          Export
        </v-btn>
        <v-menu bottom left v-if="$vuetify.breakpoint.mobile">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-view-headline</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-btn color="primary" text rounded small>
                <v-icon left dark class="mr-2"> mdi-table-column </v-icon>
                Edit Columns
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn color="primary" text rounded small>
                <v-icon left dark class="mr-2"> mdi-plus </v-icon>
                Add Vehicle
              </v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn color="primary" text rounded small>
                <v-icon left dark class="mr-2"> mdi-download-outline </v-icon>
                Export
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar>
      <v-card width="90%" class="mx-auto" style="margin-top: -49px">
        <v-tabs v-model="tabs">
          <v-tab> Inventory </v-tab>
          <v-tab> Sold </v-tab>
          <v-tab> Delivered </v-tab>
        </v-tabs>
        <v-divider />
        <v-card-text>
          <v-tabs-items v-model="tabs">
            <v-tab-item>
              <v-text-field
                dense
                outlined
                prepend-inner-icon="mdi-magnify"
                placeholder="Search by serial number, stock number, model etc."
                hide-details
              ></v-text-field>
            </v-tab-item>
          </v-tabs-items>
        </v-card-text>
      </v-card>
      <div style="width: 90%" class="mx-auto">
        <v-chip small color="secondary" class="my-5 text-caption" rounded>
          0 results
        </v-chip>
      </div>
      <v-card width="90%" class="mx-auto">
        <v-data-table :headers="headers"></v-data-table>
      </v-card>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Inventory",

  data: () => ({
    tabs: 0,
    headers: [
      {
        text: "VIN",
        value: "vin",
      },
      {
        text: "Model #",
        value: "model-#",
      },
      {
        text: "Interior Color",
        value: "interior-color",
      },
      {
        text: "Exterior Color",
        value: "exterior-color",
      },
    ],
  }),
};
</script>

<style scoped>
.top-toolbar {
  padding-left: 5%;
  padding-right: 5%;
}
</style>