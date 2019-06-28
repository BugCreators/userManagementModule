import http from "../../../http";

export default {
  /**
   * @description 专业管理-获取专业列表
   * @param { pageSize }    页码
   * @param { pageIndex }   页数
   * @param { searchValue } 搜索值
   */
  getMajorList: data => {
    return http({
      url: "/api/major/getMajorList",
      method: "post",
      data
    });
  },
  /**
   * @description 专业管理-删除专业
   * @param { majorsId } 专业ID
   */
  delMajors: data => {
    return http({
      url: "/api/major/deleteMajor",
      method: "post",
      data
    });
  },
  /**
   * @description 专业管理-导出数据-获取全部专业数据
   */
  getAllMajorList: data => {
    return http({
      url: "/api/major/getAllMajorList",
      method: "post",
      data
    });
  },
  /**
   * @descrition 专业管理-专业详情-获取专业详情
   * @param { id } 专业ID
   */
  getMajorDetail: params => {
    return http({
      url: "/api/major/getMajorDetail",
      post: "get",
      params
    });
  },
  /**
   * @descrition 专业管理-专业详情-获取院系列表
   * @param { id } 学院ID
   */
  getDepartmentListByCollegeId: params => {
    return http({
      url: "/api/department/getDepartmentListByCollegeId",
      method: "get",
      params
    });
  },
  /**
   * @description 专业管理-专业详情-修改专业信息
   * @param { info.id }                   专业ID
   * @param { info.name }                 专业名
   * @param { info.level }                专业等级
   * @param { info.college_id }           学院ID
   * @param { info.department_id }        院系ID
   * @param { info.train_objective }      培养目标
   * @param { info.main_course }          主要课程
   * @param { info.employment_direction } 就业方向
   * @param { info.description }          院系描述
   */
  changeMajor: data => {
    return http({
      url: "/api/major/changeMajor",
      method: "post",
      data
    });
  },
  /**
   * @description 专业管理-专业详情-添加专业
   * @param { info.name }                 专业名
   * @param { info.level }                专业等级
   * @param { info.college_id }           学院ID
   * @param { info.department_id }        院系ID
   * @param { info.train_objective }      培养目标
   * @param { info.main_course }          主要课程
   * @param { info.employment_direction } 就业方向
   * @param { info.description }          院系描述
   */
  addMajor: data => {
    return http({
      url: "/api/major/addMajor",
      method: "post",
      data
    });
  },
  /**
   * @description 专业管理-批量添加
   * @param { majorList } 专业列表
   */
  importMajorList: data => {
    return http({
      url: "/api/major/importMajorList",
      method: "post",
      data
    });
  }
};
