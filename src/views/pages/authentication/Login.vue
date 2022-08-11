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
            <v-alert
              v-if="errorMessage"
              color="error"
              outlined
              dense
              text
              min-width="500"
              max-width="500"
              class="mx-auto"
              >{{ errorMessage }}</v-alert
            >
            <v-card max-width="500" class="mx-auto pa-2">
              <form @submit.prevent="submitLoginForm">
                <v-card-text>
                  <v-text-field label="Email" outlined v-model="email" dense />
                  <v-text-field
                    label="Password"
                    type="password"
                    outlined
                    v-model="password"
                    hide-details
                    dense
                  />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="mx-2 mt-2">
                  <v-btn color="primary" type="submit"> Sign In </v-btn>
                  <v-spacer />
                  <p class="text-caption mb-0">
                    <router-link to="register">Forgot my password</router-link>
                  </p>
                </v-card-actions>
              </form>
            </v-card>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Login",

  data: () => ({
    email: "",
    password: "",
    errorMessage: null,
  }),
  methods: {
    ...mapActions(["login"]),
    submitLoginForm() {
      const payload = {
        email: this.email,
        password: this.password,
      };

      this.login(payload).then(
        () => {
          this.$router.push("/inventory");
        },
        () => {
          this.showError("Invalid credentials.");
        }
      );
    },
    showError(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null;
      }, 4000);
    },
  },
};
</script>

<style>
.login-text {
  display: inline-block;
}
</style>
