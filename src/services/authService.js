import http from "./baseApiHttp";

class AuthService {
  // eslint-disable-next-line no-unused-vars
  login(requestData) {
    return http.post("auth/signin", requestData);
  }

  logout() {
    return http.get("auth/signout");
  }

  verify() {
    return http.get("auth/verify");
  }
}

export default new AuthService();
