<template>
  <v-card>
    <v-card-title class="text-h6">
      Confirmation
    </v-card-title>
    <v-card-text class="black--text">
      {{ dialogContent }}
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="error"
        @click="confirm"
        rounded
      >
        Delete
      </v-btn>
      <v-btn
        color="secondary"
        text
        @click="cancel"
        rounded
      >
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'DeleteDialog',
  props: {
    dialogContent: {
      type: String,
      required: true
    }
  },
  methods: {
    confirm() {
      this.$emit('confirm');
    },
    cancel() {
      this.$emit('cancel');
    }
  }
}
</script>

<style>

</style>