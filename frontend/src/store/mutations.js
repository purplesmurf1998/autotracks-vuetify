export default {
  setUser(state, payload) {
    state.token = payload.token;
    state.loggedInUser = payload.loggedInUser;
  },
  setProperty(state, [variable, value]) {
    state[variable] = value
  },
  toggleSidebar(state) {
    state.sidebarShow = !state.sidebarShow;
  }
}