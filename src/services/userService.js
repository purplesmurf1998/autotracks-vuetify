import http from "./baseApiHttp";

class UserService {
  getDealershipUsers(accountId, dealershipId) {
    return http.get(`accounts/${accountId}/users?dealershipId=${dealershipId}`);
  }
}

export default new UserService();
