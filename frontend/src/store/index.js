import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const apiUrl = process.env.NODE_ENV == 'development' ? process.env.VUE_APP_DEV_API_URL : process.env.VUE_APP_PROD_API_URL;

export default new Vuex.Store({
  state: {
    sidebarShow: true,
    baseApiUrl: apiUrl,
    loggedInUser: null,
    token: null
  },
  mutations,
  actions,
  modules: {
  }
})
