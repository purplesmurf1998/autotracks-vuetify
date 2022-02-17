<template>
  <div>
    <v-container fill-height fluid>
      <!-- <v-row class="mt-10 ml-16">
        <h2>Parc Avenue Audi</h2>
      </v-row> -->
      <dealership-details id="dealership-details"/>
      <dealership-accounts id="dealership-accounts"/>
      <dealership-properties id="dealership-properties"/>
      <dealership-zones id="dealership-zones"/>
    </v-container>
  </div>
</template>

<script>
import DealershipDetails from './details/DealershipDetails.vue';
import DealershipAccounts from './accounts/DealershipAccounts.vue';
import DealershipProperties from './properties/DealershipProperties.vue';
import DealershipZones from './zones/DealershipZones.vue';

export default {
  name: 'Dealership',

  data: () => ({
    //
  }),
  components: {
    DealershipDetails,
    DealershipAccounts,
    DealershipProperties,
    DealershipZones
  }
}
</script>

<style>

</style>