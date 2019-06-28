import Vue from "vue";
import http from "../http";
import commonApi from "./common";

import branchApi from "./admin/admin/Branch";
import roleApi from "./admin/admin/Role";
import authorityApi from "./admin/admin/AuthorityList";
import adminApi from "./admin/admin/Administrator";

import collegeApi from "./admin/faculty/College";
import departmentApi from "./admin/faculty/Department";
import majorApi from "./admin/faculty/Major";
import classApi from "./admin/faculty/Class";

import studentApi from "./admin/account/Student";
import teacherApi from "./admin/account/Teacher";

import settingApi from "./admin/Setting";

Vue.prototype.$http = {
  /******************************管理页Api BEGIN*****************************/
  /**
   * @description 管理页-获取进入后台权限
   */
  intoBackstage: params => {
    return http({
      url: "/api/user/getIntoBackstage",
      method: "get",
      params
    });
  },
  /**
   * @description 管理页-侧边栏-获取模块查询权限
   */
  getSelectAuthority: params => {
    return http({
      url: "/api/user/getSelectAuthority",
      method: "get",
      params
    });
  },
  // 通用
  ...commonApi,
  /***********************管理员管理 ***********************/
  // 部门管理
  ...branchApi,
  // 角色管理
  ...roleApi,
  // 权限列表
  ...authorityApi,
  // 管理员列表
  ...adminApi,
  /************************院系管理 ************************/
  // 学院管理
  ...collegeApi,
  // 教学系别
  ...departmentApi,
  // 专业管理
  ...majorApi,
  // 班级管理
  ...classApi,
  /************************账号管理 ************************/
  // 学生列表
  ...studentApi,
  // 教师列表
  ...teacherApi,
  /************************系统设置 ************************/
  ...settingApi
  /******************************管理页Api END*****************************/
};
