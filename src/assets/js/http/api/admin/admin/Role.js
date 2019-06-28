import http from "../../../http";

export default {
  /**
   * @description 角色管理-获取角色列表
   * @param { pageSize }    页码
   * @param { pageIndex }   页数
   * @param { searchValue } 搜索值
   */
  getRoleList: data => {
    return http({
      url: "/api/role/getRoleList",
      method: "post",
      data
    });
  },
  /**
   * @description 角色管理-删除角色
   * @param { rolesId } 角色ID
   */
  delRoles: data => {
    return http({
      url: "/api/role/deleteRole",
      method: "post",
      data
    });
  },
  /**
   * @descrition 角色管理-角色详情-获取角色详情
   * @param { id } 角色ID
   */
  getRoleDetail: params => {
    return http({
      url: "/api/role/getRoleDetail",
      method: "get",
      params
    });
  },
  /**
   * @description 角色管理-角色详情-获取部门列表
   */
  getBranchListByRoleDetail: params => {
    return http({
      url: "/api/branch/getBranchListByRoleDetail",
      method: "get",
      params
    });
  },
  /**
   * @description 角色管理-角色详情-获取模块列表
   */
  getModuleList: data => {
    return http({
      url: "/api/role/getModuleList",
      method: "post",
      data
    });
  },
  /**
   * @description 角色管理-角色详情-修改角色信息
   * @param { id }          角色ID
   * @param { name }        角色名
   * @param { level }       权限等级
   * @param { description } 角色描述
   * @param { module }      模块权限
   */
  changeRole: data => {
    return http({
      url: "/api/role/changeRole",
      method: "post",
      data
    });
  },
  /**
   * @description 角色管理-角色详情-添加角色
   * @param { id }          角色ID
   * @param { name }        角色名
   * @param { level }       权限等级
   * @param { description } 角色描述
   * @param { module }      模块权限
   */
  addRole: data => {
    return http({
      url: "/api/role/addRole",
      method: "post",
      data
    });
  }
};
