<template>
  <v-card width="90%" class="mx-auto mt-5">
    <v-fade-transition>
      <v-card flat v-if="addingZone">
        <v-card-title>Adding a location</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-text-field
                label="Location Name"
                outlined
                dense
                hide-details
                class="mb-2"
                v-model="newName"
              />
              <v-textarea
                label="Location Description"
                outlined
                dense
                hide-details
                rows="5"
                class="mb-2"
                v-model="newDescription"
              />
              <v-btn
                color="primary"
                small
                class="mr-2"
                :disabled="newName == '' || newPath.length < 3"
              >
                Save
              </v-btn>
              <v-btn
                color="error"
                small
                text
                class="mr-2"
                :disabled="newPath.length == 0"
                @click="undoPoint"
              >
                Undo
              </v-btn>
              <v-btn
                color="secondary"
                small
                text
                @click="$emit('adding-zone', false)"
              >
                Cancel
              </v-btn>
            </v-col>
            <v-col>
              <p class="text-h4">Step 1</p>
              <p>
                Enter the required name of the location and an optional
                description.
              </p>
              <p class="text-h4">Step 2</p>
              <p>
                Click on the map to add a point and define the perimeter of the
                location.
              </p>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-fade-transition>
    <GmapMap
      :center="center"
      :zoom="17"
      ref="mapRef"
      style="height: 500px"
      :options="{
        streetViewControl: false,
        fullscreenControl: true,
        rotateControl: false,
      }"
      @click="addPoint"
    >
      <gmap-polygon
        v-if="newPath.length > 0 && addingZone"
        ref="newZonePolygonRef"
        :paths="newPath"
        v-model="newPath"
        :editable="true"
        :visible="true"
        :options="{ fillColor: 'red', fillOpacity: 0.5, strokeWeight: 1 }"
        @click="addPoint"
        @paths_changed="updateNewPath($event)"
      />
    </GmapMap>
  </v-card>
</template>

<script>
import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDnzuP55GknIhhOh5L1pJbpPc5DBkc_2pM",
  },
});

export default {
  name: "DealershipZones",
  props: {
    addingZone: {
      type: Boolean,
      required: true,
    },
  },
  data: () => ({
    center: { lat: 45.431311, lng: -73.479005 },
    newPath: [],
    newName: "",
    newDescription: "",
  }),
  methods: {
    addPoint(point) {
      if (!this.addingZone) return;

      const path = {
        lat: point.latLng.lat(),
        lng: point.latLng.lng(),
      };

      this.newPath.push(path);
    },
    updateNewPath(paths) {
      let tempPaths = [];
      for (let i = 0; i < paths.getLength(); i++) {
        for (let j = 0; j < paths.getAt(i).getLength(); j++) {
          tempPaths.push({
            lat: paths.getAt(i).getAt(j).lat(),
            lng: paths.getAt(i).getAt(j).lng(),
          });
        }
      }

      this.newPath = tempPaths;
    },
    undoPoint() {
      if (!this.newPath.length > 0 || !this.addingZone) return;

      this.newPath.pop();
    },
  },
};
</script>

<style>
</style>