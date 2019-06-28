import http from "../../../http";

export default {
  /**
   * @description 部门管理-获取部门列表
   * @param { pageSize }    页码
   * @param { pageIndex }   页数
   * @param { searchValue } 搜索值
   */
  getBranchList: data => {
    return http({
      url: "/api/branch/getBranchList",
      method: "post",
      data
    });
  },
  /**
   * @description 部门管理-删除部门
   * @param { branchsId } 部门ID
   */
  delBranch: data => {
    return http({
      url: "/api/branch/deleteBranch",
      method: "post",
      data
    });
  },
  /**
   * @description 部门管理-导出数据-获取全部部门数据
   */
  getAllBranchList: data => {
    return http({
      url: "/api/branch/getAllBranchList",
      method: "post",
      data
    });
  },
  /**
   * @descrition 部门管理-部门详情-获取部门详情
   * @param { id } 部门ID
   */
  getBranchDetail: params => {
    return http({
      url: "/api/branch/getBranchDetail",
      method: "get",
      params
    });
  },
  /**
   * @description 部门管理-部门详情-修改部门信息
   * @param { info.id }             部门ID
   * @param { info.name }           部门名
   * @param { info.level }          部门等级
   * @param { info.operating_duty } 主要职能
   * @param { info.description }    部门描述
   * @param { info.website }        部门官网
   */
  changeBranch: data => {
    return http({
      url: "/api/branch/changeBranch",
      method: "post",
      data
    });
  },
  /**
   * @description 部门管理-部门详情-修改部门信息
   * @param { info.name }           部门名
   * @param { info.level }          部门等级
   * @param { info.operating_duty } 主要职能
   * @param { info.description }    部门描述
   * @param { info.website }        部门官网
   */
  addBranch: data => {
    return http({
      url: "/api/branch/addBranch",
      method: "post",
      data
    });
  },
  /**
   * @description 部门管理-批量添加
   * @param { branchList } 部门列表
   */
  importBranchList: data => {
    return http({
      url: "/api/branch/importBranchList",
      method: "post",
      data
    });
  }
};
