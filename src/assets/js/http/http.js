import axios from "axios";
import { stringify } from "qs";

// axios.defaults.baseURL = "http://avue.club:8080";
axios.defaults.baseURL = "http://api.avue.com";
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

axios.interceptors.request.use(config => {
  switch (config.method) {
    case "post":
      if (config.data.constructor !== FormData) {
        config.data = stringify(config.data);
      }
      break;
    case "get":
      break;
    default:
      break;
  }

  return config;
});

export default axios;
