import http from "../../../http";

export default {
  /**
   * @description 教学系别-获取院系列表
   * @param { pageSize }    页码
   * @param { pageIndex }   页数
   * @param { searchValue } 搜索值
   */
  getDepartmentList: data => {
    return http({
      url: "/api/department/getDepartmentList",
      method: "post",
      data
    });
  },
  /**
   * @description 教学系别-删除院系
   * @param { departmentsId } 院系ID
   */
  delDepartments: data => {
    return http({
      url: "/api/department/deleteDepartments",
      method: "post",
      data
    });
  },
  /**
   * @description 教学系别-导出数据-获取全部院系数据
   */
  getAllDepartmentList: data => {
    return http({
      url: "/api/department/getAllDepartmentList",
      method: "post",
      data
    });
  },
  /**
   * @descrition 教学系别-院系详情-获取院系详情
   * @param { id } 院系ID
   */
  getDepartmentDetail: params => {
    return http({
      url: "/api/department/getDepartmentDetail",
      method: "get",
      params
    });
  },
  /**
   * @description 教学系别-院系详情-修改院系信息
   * @param { info.id }      院系ID
   * @param { info.name }    院系名
   * @param { info.college } 学院ID
   * @param { info.description }  院系描述
   */
  changeDepartment: data => {
    return http({
      url: "/api/department/changeDepartment",
      method: "post",
      data
    });
  },
  /**
   * @description 教学系别-院系详情-添加院系
   * @param { info.name }    院系名
   * @param { info.college } 学院ID
   * @param { info.description }  院系描述
   */
  addDepartment: data => {
    return http({
      url: "/api/department/addDepartment",
      method: "post",
      data
    });
  },
  /**
   * @description 教学系别-批量添加
   * @param { departmentList } 院系列表
   */
  importDepartmentList: data => {
    return http({
      url: "/api/department/importDepartmentList",
      method: "post",
      data
    });
  }
};
