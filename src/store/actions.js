import AuthService from "../services/authService";

export default {
  login(context, payload) {
    // login user and set user in the store
    const requestData = {
      email: payload.email,
      password: payload.password,
    };

    return new Promise((resolve, reject) => {
      AuthService.login(requestData).then(
        (httpResponse) => {
          const { user, token } = httpResponse.data;
          // set the token in the local storage
          localStorage.setItem("autotracksAuthToken", token);
          // set the data in the store's state
          context.commit("setUser", user);
          // set the token in the store's state
          context.commit("setToken", token);
          resolve({ success: true });
        },
        (error) => {
          reject(error);
        }
      );
    });
  },
  logout(context) {
    // clear the token from the local storage
    localStorage.clear("autotracksAuthToken");
    // set the token to null
    context.commit("setToken", null);
    // set the user to null
    context.commit("setUser", null);
  },
  async verify(context) {
    const currentToken = localStorage.getItem("autotracksAuthToken");
    // if there is a token
    context.commit("setToken", currentToken);
    try {
      const httpResponse = await AuthService.verify();
      const { user, token } = httpResponse.data;
      context.commit("setUser", user);
      context.commit("setToken", token);
    } catch (error) {
      context.dispatch("logout");
    }
  },
};
