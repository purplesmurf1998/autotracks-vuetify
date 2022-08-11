import axios from "axios";
import store from "../store";

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
});

http.interceptors.request.use(async (req) => {
  const token = store.state.token;
  req.headers.Authorization = "Bearer " + token;
  if (req.data) req.headers["Content-Type"] = "application/json";

  return req;
});

export default http;
