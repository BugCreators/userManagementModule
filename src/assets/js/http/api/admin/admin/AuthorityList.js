import http from "../../../http";

export default {
  /**
   * @description 权限列表-获取权限列表
   * @param { pageSize }    页码
   * @param { pageIndex }   页数
   * @param { searchValue } 搜索值
   */
  getAuthorityList: data => {
    return http({
      url: "/api/authority/getAuthorityList",
      method: "post",
      data
    });
  }
};
