import http from "../../../http";

export default {
  /**
   * @description 班级管理-获取班级列表
   * @param { pageSize }    页码
   * @param { pageIndex }   页数
   * @param { searchValue } 搜索值
   */
  getClassList: data => {
    return http({
      url: "/api/vclass/getClassList",
      method: "post",
      data
    });
  },
  /**
   * @description 班级管理-删除班级
   * @param { classId } 班级ID
   */
  delClass: data => {
    return http({
      url: "/api/vclass/deleteClass",
      method: "post",
      data
    });
  },
  /**
   * @description 班级管理-导出数据-获取全部班级数据
   */
  getAllClassList: data => {
    return http({
      url: "/api/vclass/getAllClassList",
      method: "post",
      data
    });
  },
  /**
   * @descrition 班级管理-班级详情-获取班级详情
   * @param { id } 班级ID
   */
  getClassDetail: params => {
    return http({
      url: "/api/vclass/getClassDetail",
      method: "get",
      params
    });
  },
  /**
   * @description 班级管理-班级详情-获取年级列表
   */
  getGradeList: () => {
    return http({
      url: "/api/user/getGradeList",
      method: "get"
    });
  },
  /**
   * @description 班级管理-班级详情-获取专业列表
   * @description 学生列表-学生详情
   * @description 学生列表-导出数据
   * @description 学生列表-批量添加
   * @param { id } 学院ID
   */
  getMajorListBycollegeId: params => {
    return http({
      url: "/api/major/getMajorListByCollegeId",
      method: "get",
      params
    });
  },
  /**
   * @description 班级管理-班级详情-修改班级信息
   * @param { info.id }                   班级ID
   * @param { info.name }                 班级名
   * @param { info.grade }                年级
   * @param { info.major_id }             专业ID
   * @param { info.college_id }           学院ID
   */
  changeClass: data => {
    return http({
      url: "/api/vclass/changeClass",
      method: "post",
      data
    });
  },
  /**
   * @description 班级管理-班级详情-添加班级
   * @param { info.name }                 班级名
   * @param { info.grade }                年级
   * @param { info.major_id }             专业ID
   * @param { info.college_id }           学院ID
   */
  addClass: data => {
    return http({
      url: "/api/vclass/addClass",
      method: "post",
      data
    });
  },
  /**
   * @description 班级管理-批量添加
   * @param { classList } 班级列表
   */
  importClassList: data => {
    return http({
      url: "/api/vclass/importClassList",
      method: "post",
      data
    });
  }
};
