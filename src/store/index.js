import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebarShow: true
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarShow = !this.sidebarShow;
    }
  },
  actions: {
  },
  modules: {
  }
})
