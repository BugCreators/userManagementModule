import http from "../../../http";

export default {
  /**
   * @description 学生列表-获取学生列表
   * @param { pageSize }    页码
   * @param { pageIndex }   页数
   * @param { searchValue } 搜索值
   */
  getStudentList: data => {
    return http({
      url: "/api/student/getStudentList",
      method: "post",
      data
    });
  },
  /**
   * @description 学生列表-重置密码
   * @param { id } 学生ID
   */
  resetPwStudent: params => {
    return http({
      url: "/api/student/resetPassword",
      method: "get",
      params
    });
  },
  /**
   * @description 学生列表-删除学生
   * @param { studentsId } 学生ID
   */
  delStudents: data => {
    return http({
      url: "/api/student/deleteStudent",
      method: "post",
      data
    });
  },
  /**
   * @description 学生列表-学生详情-获取学生详情
   * @param { id } 学生ID
   */
  getStudentDetail: params => {
    return http({
      url: "/api/student/getStudentDetail",
      method: "get",
      params
    });
  },
  /**
   * @description 学生列表-学生详情-获取班级列表
   * @description 学生列表-导出数据
   * @description 学生列表-批量添加
   * @param { id } 专业ID
   */
  getClassListByMajorId: params => {
    return http({
      url: "/api/vclass/getClassListByMajorId",
      method: "get",
      params
    });
  },
  /**
   * @description 学生列表-学生详情-修改学生信息
   * @param { data }             基本信息
   * @param { data.id }          学生ID
   * @param { data.realName }    姓名
   * @param { data.number }      账号/学号
   * @param { data.class_id }    班级ID
   * @param { data.sex }         性别
   * @param { data.phone }       电话
   * @param { data.email }       邮箱
   * @param { data.address }     地址
   * @param { data.description } 个人描述
   */
  changeStudent: data => {
    return http({
      url: "/api/student/changeStudent",
      method: "post",
      data
    });
  },
  /**
   * @description 学生列表-学生详情-添加学生
   * @param { data }             基本信息
   * @param { data.realName }    姓名
   * @param { data.number }      账号/学号
   * @param { data.class_id }    班级ID
   * @param { data.sex }         性别
   * @param { data.phone }       电话
   * @param { data.email }       邮箱
   * @param { data.address }     地址
   * @param { data.description } 个人描述
   */
  addStudent: data => {
    return http({
      url: "/api/student/addStudent",
      method: "post",
      data
    });
  },
  /**
   * @description 学生列表-导出数据-获取学生数据
   * @param { data }            索引数据
   * @param { data.college_id } 学院ID
   * @param { data.major_id }   专业ID
   * @param { data.class_id }   班级ID
   */
  getAllStudentList: data => {
    return http({
      url: "/api/student/getAllStudentList",
      method: "post",
      data
    });
  },
  /**
   * @description 学生列表-批量添加
   * @param { data }            索引数据
   * @param { data.college_id } 学院ID
   * @param { data.major_id }   专业ID
   * @param { data.class_id }   班级ID
   * @param { studentList }     学生数据
   */
  importStudentList: data => {
    return http({
      url: "/api/student/importStudentList",
      method: "post",
      data
    });
  }
};
