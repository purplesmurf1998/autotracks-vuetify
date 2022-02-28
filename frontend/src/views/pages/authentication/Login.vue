<template>
  <div class="app">
    <v-app>
      <v-main>
        <v-container class="grey lighten-4" fluid fill-height>
          <v-col>
            <v-row justify="center">
              <p class="text-h3 font-weight-light login-text">Autotracks</p>
            </v-row>
            <v-row class="mb-3" justify="center">
              <p class="font-weight-light login-text">
                Login in to your favorite management console
              </p>
            </v-row>
            <v-card min-width="500" max-width="500" class="mx-auto pa-2">
              <v-card-text>
                <v-text-field
                  label="Email"
                  outlined
                  v-model="email"
                  autofocus
                  autocomplete="off"
                />
                <v-text-field
                  label="Password"
                  type="password"
                  outlined
                  v-model="password"
                  hide-details
                  autocomplete="off"
                />
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="primary" rounded> Login </v-btn>
                <v-spacer />
                <p class="text-caption mb-0">
                  Forgot your password?
                  <router-link to="dashboard">Click here</router-link>
                </p>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "Login",

  data: () => ({
    email: "",
    password: "",
    autofill: false,
  }),
};
</script>

<style>
.login-text {
  display: inline-block;
}
</style>