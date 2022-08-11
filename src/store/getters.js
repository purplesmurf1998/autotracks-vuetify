export default {
  userId(state) {
    return state.user ? state.user._id : null;
  },
  accountId(state) {
    return state.user ? state.user.account_id : null;
  },
  activeDealershipId(state) {
    return state.user
      ? state.user.active_dealership_id
        ? state.user.active_dealership_id._id
        : null
      : null;
  },
  activeDealershipName(state) {
    return state.user
      ? state.user.active_dealership_id
        ? state.user.active_dealership_id.name
        : null
      : null;
  },
  displayName(state) {
    return state.user ? state.user.display_name : null;
  },
  email(state) {
    return state.user ? state.user.email : null;
  },
  isAdmin(state) {
    return state.user ? state.user.is_account_admin : null;
  },
  theme(state) {
    return state.user ? state.user.preferences.theme : null;
  },
  language(state) {
    return state.user ? state.user.preferences.language : null;
  },
};
