import Vue from "vue";
import Vuex from "vuex";

import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

Vue.use(Vuex);

const apiUrl = process.env.VUE_APP_API_URL;

export default new Vuex.Store({
  state: {
    sidebarShow: true,
    baseApiUrl: apiUrl,
    user: null,
    token: null,
  },
  mutations,
  actions,
  getters,
});
