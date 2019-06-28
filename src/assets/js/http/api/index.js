import Vue from "vue";
import http from "../http";

import commonApi from "./common";

Vue.prototype.$http = {
  // 通用
  ...commonApi,
  /**
   * @description 首页-获取学院详情
   * @param { id } 学院ID
   */
  getCollegeDetail: params => {
    return http({
      url: "/api/college/getCollegeDetail",
      method: "get",
      params
    });
  },
  /**
   * @description 首頁-个人信息-获取用戶信息
   * @param { number } 用戶账号
   */
  getUserInfo: data => {
    return http({
      url: "/api/user/getUserInfo",
      method: "post",
      data
    });
  },
  /**
   * @description 首页-个人信息-修改用户信息
   * @param { number }       用户账号
   * @param { email }        邮箱
   * @param { sex }          性别 男：1 女：0
   * @param { address }      地址
   * @param { description }  个人描述
   *
   */
  changeInfoByUser: data => {
    return http({
      url: "/api/user/changeUserInfoByUser",
      method: "post",
      data
    });
  },
  /**
   * @description 首页-修改用户密码
   */
  changePasswordByUser: data => {
    return http({
      url: "/api/user/changePasswordByUser",
      method: "post",
      data
    });
  }
};
