<template>
  <v-card>
    <v-card-title class="text-h6">
      Vehicle Details
    </v-card-title>
    <v-card-text class="pt-3">
      This is the vehicle details dialog
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        text
        @click="clearSelectedVehicle"
        rounded
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'VehicleDetails',
  props: {
    vehicleId: {
      type: String,
      required: true
    },
    clearSelectedVehicle: {
      type: Function,
      required: true
    }
  },
  data: () => ({
    //
  })
}
</script>

<style>

</style>