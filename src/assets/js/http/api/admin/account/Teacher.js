import http from "../../../http";

export default {
  /**
   * @description 教师列表-获取教师列表
   * @param { pageSize }    页码
   * @param { pageIndex }   页数
   * @param { searchValue } 搜索值
   */
  getTeacherList: data => {
    return http({
      url: "/api/teacher/getTeacherList",
      method: "post",
      data
    });
  },
  /**
   * @description 教师列表-重置密码
   * @param { id } 教师ID
   */
  resetPwTeacher: params => {
    return http({
      url: "/api/teacher/resetPassword",
      method: "get",
      params
    });
  },
  /**
   * @description 教师列表-删除教师
   * @param { teachersId } 教师ID
   */
  delTeachers: data => {
    return http({
      url: "/api/teacher/deleteTeacher",
      method: "post",
      data
    });
  },
  /**
   * @description 教师列表-导出数据-获取教师数据
   */
  getAllTeacherList: data => {
    return http({
      url: "/api/teacher/getAllTeacherList",
      method: "post",
      data
    });
  },
  /**
   * @description 教师列表-教师详情-获取教师详情
   * @param { id } 教师ID
   */
  getTeacherDetail: params => {
    return http({
      url: "/api/teacher/getTeacherDetail",
      method: "get",
      params
    });
  },
  /**
   * @description 教师列表-教师详情-修改教师信息
   * @param { data }             基本信息
   * @param { data.id }          教师ID
   * @param { data.realName }    姓名
   * @param { data.number }      账号/职工号
   * @param { data.college_id }  学院ID
   * @param { data.sex }         性别
   * @param { data.phone }       电话
   * @param { data.email }       邮箱
   * @param { data.address }     地址
   * @param { data.description } 个人描述
   */
  changeTeacher: data => {
    return http({
      url: "/api/teacher/changeTeacher",
      method: "post",
      data
    });
  },
  /**
   * @description 教师列表-教师详情-添加教师
   * @param { data }             基本信息
   * @param { data.realName }    姓名
   * @param { data.number }      账号/职工号
   * @param { data.college_id }  学院ID
   * @param { data.sex }         性别
   * @param { data.phone }       电话
   * @param { data.email }       邮箱
   * @param { data.address }     地址
   * @param { data.description } 个人描述
   */
  addTeacher: data => {
    return http({
      url: "/api/teacher/addTeacher",
      method: "post",
      data
    });
  },
  /**
   * @description 教师列表-批量添加
   * @param { teacherList } 教师数据
   */
  importTeacherList: data => {
    return http({
      url: "/api/teacher/importTeacherList",
      method: "post",
      data
    });
  }
};
