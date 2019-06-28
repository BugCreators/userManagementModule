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
  }
};
