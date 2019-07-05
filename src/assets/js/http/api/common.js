import http from "../http";

export default {
  /*************************** 通用 ***************************/
  /**
   * @description 获取系统设置
   */
  getSysSetting: () => {
    return http({
      url: "/api/system/getSysSetting",
      method: "get"
    });
  },
  /**
   * @description 获取学院列表
   */
  getCollegeList: () => {
    return http({
      url: "/api/college/getCollegeList",
      method: "get"
    });
  },
  /**
   * @description 首頁-个人信息-获取用戶信息
   * @description 后台管理-个人信息
   * @param { number } 用戶账号
   */
  getUserInfo: data => {
    return http({
      url: "/api/user/getUserInfo",
      method: "post",
      data
    });
  },
};
