import http from "../../../http";

export default {
  /**
   * @description 管理员列表-获取管理员列表
   * @param { pageSize }    页码
   * @param { pageIndex }   页数
   * @param { searchValue } 搜索值
   */
  getAdministratorList: data => {
    return http({
      url: "/api/admin/getAdminList",
      method: "post",
      data
    });
  },
  /**
   * @description 管理员列表-修改管理员密码
   * @param { id } 管理员ID
   */
  resetPwAdmin: params => {
    return http({
      url: "/api/admin/resetPassword",
      method: "get",
      params
    });
  },
  /**
   * @description 管理员列表-删除管理员
   * @param { adminsId } 管理员ID
   */
  delAdministrators: data => {
    return http({
      url: "/api/admin/deleteAdmin",
      method: "post",
      data
    });
  },
  /**
   * @description 管理员列表-管理员详情-获取管理员详情
   * @param { id } 管理员ID
   */
  getAdministratorDetail: params => {
    return http({
      url: "/api/admin/getAdminDetail",
      method: "get",
      params
    });
  },
  /**
   * @description 管理员列表-管理员详情-获取部门列表
   */
  getBranchListByAdminDetail: params => {
    return http({
      url: "/api/branch/getBranchListByAdminDetail",
      method: "get",
      params
    });
  },
  /**
   * @description 管理员列表-管理员详情-获取角色列表
   * @param { branchId } 部门ID
   */
  getRoleListByBranchId: params => {
    return http({
      url: "/api/role/getRoleListByBranchId",
      method: "get",
      params
    });
  },
  /**
   * @description 管理员列表-管理员详情-修改管理员信息
   * @param { data }             基本信息
   * @param { data.id }          管理员ID
   * @param { data.realname }    管理员姓名
   * @param { data.number }      管理员账号/职工号
   * @param { data.branch_id }   管理员部门ID
   * @param { data.role_id }     管理员身份ID
   * @param { data.phone }       电话
   * @param { data.address }     地址
   * @param { data.email }       邮箱
   * @param { data.description } 个人描述
   * @param { moduleList }       权限列表
   */
  changeAdministrator: data => {
    return http({
      url: "/api/admin/changeAdmin",
      method: "post",
      data
    });
  },
  /**
   * @description 管理员列表-管理员详情-修改管理员信息
   * @param { data }             基本信息
   * @param { data.realname }    管理员姓名
   * @param { data.number }      管理员账号/职工号
   * @param { data.branch_id }   管理员部门ID
   * @param { data.role_id }     管理员身份ID
   * @param { data.phone }       电话
   * @param { data.address }     地址
   * @param { data.email }       邮箱
   * @param { data.description } 个人描述
   * @param { moduleList }       权限列表
   */
  addAdministrator: data => {
    return http({
      url: "/api/admin/addAdmin",
      method: "post",
      data
    });
  }
};
