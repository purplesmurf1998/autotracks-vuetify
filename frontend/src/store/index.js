import Vue from 'vue'
import Vuex from 'vuex'

import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebarShow: true,
    baseApiUrl: "http://localhost:5000/api/v1",
    loggedInUser: null,
    token: null
  },
  mutations,
  actions,
  modules: {
  }
})
