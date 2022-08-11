export default {
  setUser(state, user) {
    state.user = user;
  },
  setToken(state, token) {
    state.token = token;
  },
  setProperty(state, [variable, value]) {
    state[variable] = value;
  },
  toggleSidebar(state) {
    state.sidebarShow = !state.sidebarShow;
  },
};
