import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { stringify } from "qs";

Vue.use(Vuex);

// const baseUrl = "http://127.0.0.1/avue/public";
const baseUrl = "http://api.avue.com";

export default new Vuex.Store({
  state: {
    /*******************基础数据********************/
    // 设置
    setting: ``,
    /*{
      schoolAddr,
      schoolName,
      bannerHref,
      bannerUri,
      logoUri,
      // 网站备案
      copyright,
      icp
    }*/
    // 搜索值
    searchValue: {
      college: ``,
      department: ``,
      class: ``,
      name: ``
    },
    // 默认logo
    defaultLogo: require(`../images/default/logo.png`),
    // 管理页logo
    adminLogo: require(`../images/default/logo_admin.png`),
    // 默认头像
    defaultHeader: `/assets/images/default/head.png`,
    // 默认学院封面
    defaultCollege: require(`../images/default/college.png`),
    // defaultCollegeDetail: require (`../images/default/college_detail.png`),
    defaultBanner: require(`../images/default/banner.png`),
    defaultNoData: require(`../images/NoData.png`),
    // 用户信息
    userInfo: {
      number: ``,
      password: ``,
      realname: ``,
      intoBackstage: ``,
      token: ``,
      roleName: ``
    },
    // 查询权限
    selectAuthority: {
      select_admin: 0,
      select_admin_department: 0,
      select_capabilities: 0,
      select_class: 0,
      select_college: 0,
      select_department: 0,
      select_major: 0,
      select_role: 0,
      select_student: 0,
      select_teacher: 0
    },

    sidebar: [
      {
        name: "admin",
        title: "管理员管理",
        class: "el-icon-admin",
        show: false,
        item: [
          {
            name: "branch",
            title: "部门管理",
            href: "branch",
            show: "select_admin_department"
          },
          {
            name: "role",
            title: "角色管理",
            href: "role",
            show: "select_role"
          },
          {
            name: "authority",
            title: "权限管理",
            href: "authority",
            show: "select_capabilities"
          },
          {
            name: "administrator",
            title: "管理员列表",
            href: "administrator",
            show: "select_admin"
          }
        ]
      },
      {
        name: "depart",
        title: "学系管理",
        class: "el-icon-depart",
        show: false,
        item: [
          {
            name: "college",
            title: "学院管理",
            href: "college",
            show: "select_college"
          },
          {
            name: "department",
            title: "院系机构",
            href: "department",
            show: "select_department"
          },
          {
            name: "major",
            title: "专业管理",
            href: "major",
            show: "select_major"
          },
          {
            name: "class",
            title: "班级管理",
            href: "class",
            show: "select_class"
          }
        ]
      },
      {
        name: "userManagement",
        title: "账号管理",
        class: "el-icon-user",
        show: false,
        item: [
          {
            name: "student",
            title: "学生列表",
            href: "student",
            show: "select_student"
          },
          {
            name: "teacher",
            title: "教师列表",
            href: "teacher",
            show: "select_teacher"
          }
        ]
      },
      {
        name: "userInfo",
        title: "个人信息",
        class: "el-icon-edit-outline",
        show: true,
        href: "userInfo"
      },
      {
        name: "changePw",
        title: "修改密码",
        class: "el-icon-edit",
        show: true,
        href: "changePw"
      }
      // ,
      // {
      //   name: "setting",
      //   title: "基本设置",
      //   class: "el-icon-setting",
      //   href: "setting"
      // }
    ],

    // 学院详情对话框
    showDetailLog: false,

    // 批量导入对话框
    showImportLog: false,

    /*******************网络接口*******************/
    // 系统设置
    getSysSetting: baseUrl + `/api/user/getSysSetting`,
    // 学院列表
    getCollegeList: baseUrl + `/api/college/getCollegeList`,
    // 学院详情 参数: id
    getCollegeDetail: baseUrl + `/api/college/getCollegeDetail`,
    // 用户登录 参数：name, password
    login: baseUrl + `/api/user/login`,
    // 获取用户信息
    getUserInfo: baseUrl + `/api/user/getUserInfo`,
    // 获取Token
    getToken: baseUrl + `/api/api/lssue`,
    // 修改个人信息
    changeUserInfoByUser: baseUrl + `/api/user/changeUserInfoByUser`,
    // 用户修改密码
    changePasswordByUser: baseUrl + `/api/user/changePasswordByUser`,
    /***************学院管理*****************/
    // 学院列表
    getCollegeListByAdmin: baseUrl + `/api/college/getCollegeListByAdmin`,
    // 学院详情
    getCollegeDetailByAdmin: baseUrl + `/api/college/getCollegeDetailByAdmin`,
    // 添加学院
    addCollege: ``,
    // 删除学院
    delColleges: ``,
    // 批量添加
    batchAddCollege: ``,
    // 修改学院
    changeCollege: ``,
    /************获取权限 BEGIN**************/
    // 进入后台权限
    intoBackstage: baseUrl + `/api/user/getIntoBackstage`,
    // 查询权限
    getSelectAuthority: baseUrl + `/api/user/getSelectAuthority`
    /****************END********************/
  },
  mutations: {
    clearUserInfo(state) {
      state.userInfo = ``;
    },
    setSearchValue(state, value) {
      state.searchValue = value;
    },
    setSelectAuthority(state, selectAuthority) {
      state.selectAuthority = selectAuthority;
      this.commit("setSidebarItemShow");
    },
    setSetting(state, setting) {
      state.setting = setting;
    },
    setSidebarItemShow(state) {
      for (let i = 0; i < state.sidebar.length; i++) {
        if (!state.sidebar[i].item) {
          continue;
        }
        for (let item of state.sidebar[i].item) {
          if (state.selectAuthority[item.show]) {
            state.sidebar[i].show = true;
            break;
          }
        }
      }
    },
    switchDetailLog(state) {
      state.showDetailLog = !state.showDetailLog;
    },
    switchImportLog(state) {
      state.showImportLog = !state.showImportLog;
    }
  },
  actions: {
    // eslint-disable-next-line
    getItems({ commit, state }, opts) {
      return axios
        .get(opts.url, {
          params: opts.query
        })
        .then(
          res => {
            opts.cb(res.data);
          },
          err => {
            console.log(err);
          }
        );
    },
    // eslint-disable-next-line
    postItems({ commit, state }, opts) {
      return axios
        .post(opts.url, stringify(opts.query), {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
          }
        })
        .then(
          res => {
            opts.cb(res.data);
          },
          err => {
            console.log(err);
          }
        );
    },
    //有数组的请求.
    // eslint-disable-next-line
    postArrItems({ commit, state }, opts) {
      state.postItems(
        opts.url,
        stringify(opts.query, {
          indices: false
        })
      );
    },
    // postArrItems({ commit, state }, opts) {
    //   axios
    //     .post(
    //       opts.url,
    //       stringify(opts.query, {
    //         indices: false
    //       })
    //     )
    //     .then(
    //       res => {
    //         opts.cb(res);
    //       },
    //       err => {
    //         console.log(err);
    //       }
    //     );
    // },
    // eslint-disable-next-line
    getUserInfo({ commit, state }) {
      let c_start, c_end;
      if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf("avueUser=");
        if (c_start != -1) {
          c_start = c_start + "avueUser=".length;
          c_end = document.cookie.indexOf(";", c_start);
          if (c_end == -1) c_end = document.cookie.length;
          state.userInfo = JSON.parse(
            decodeURIComponent(document.cookie.substring(c_start, c_end))
          );
          return true;
        } else {
          document.cookie = "avueUser=" + "null";
        }
      }
      return false;
    },
    clearUserInfo() {
      document.cookie = "avueUser=" + "null";
      localStorage.token = ``;
    }
  }
});
