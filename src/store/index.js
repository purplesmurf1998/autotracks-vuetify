import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sidebarShow: true
  },
  mutations: {
    toggleSidebar() {
      this.state.sidebarShow = !this.state.sidebarShow;
    }
  },
  actions: {
  },
  modules: {
  }
})
