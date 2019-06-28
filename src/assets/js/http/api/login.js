import Vue from "vue";
import http from "../http";

import commonApi from "./common";

Vue.prototype.$http = {
  ...commonApi,
  /**
   * @description 登录
   * @param { number }        用户账号
   * @param { password }      用户密码
   */
  login: data => {
    return http({
      url: "/api/user/login",
      method: "post",
      data
    });
  }
};
