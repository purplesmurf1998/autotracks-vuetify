import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebarShow: true,
    baseApiUrl: "https://autotracks-api.azurewebsites.net/api/v1",
    loggedInUser: null,
    token: null
  },
  mutations,
  actions,
  modules: {
  }
})
