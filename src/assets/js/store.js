import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// const baseUrl = "http://api.avue.com";
const baseUrl = "http://avue.club:8080";

export default new Vuex.Store({
  state: {
    /*******************基础数据********************/
    // 设置
    setting: {
      schoolInfo: {
        schoolAddress: ``,
        schoolName: ``
      },
      // 走马灯图片
      carousel: [
        {
          url: "",
          href: ""
        }
      ],
      // 其它系统链接
      systemWebsite: []
    },
    // 搜索值
    searchValue: {
      basis: 0,
      name: ``
    },
    baseUrl: baseUrl,
    // 默认logo
    defaultLogo: require(`../images/default/logo.png`),
    // 管理页logo
    adminLogo: require(`../images/default/logo_admin.png`),
    // 默认头像
    defaultHeader: `/assets/images/default/head.png`,
    // 默认学院封面
    defaultCollege: require(`../images/default/college.png`),
    defaultBanner: require(`../images/default/banner.png`),
    defaultNoData: require(`../images/NoData.png`),
    // 用户信息
    userInfo: ``,
    // 查询权限
    selectAuthority: {
      select_admin: 0,
      select_admin_department: 0,
      select_authority: 0,
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
            show: "select_branch"
          },
          {
            name: "role",
            title: "角色管理",
            href: "role",
            show: "select_role"
          },
          {
            name: "authority",
            title: "权限列表",
            href: "authority",
            show: "select_authority"
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
            title: "教学系别",
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
        href: "userInfo"
      },
      {
        name: "changePw",
        title: "修改密码",
        class: "el-icon-edit",
        href: "changePw"
      },
      {
        name: "setting",
        title: "基本设置",
        class: "el-icon-setting",
        show: "select_system_setting",
        href: "setting"
      }
    ],

    // 学院详情对话框
    showDetailLog: false,

    // 批量导入对话框
    showImportLog: false,

    // 上传院徽
    showLogoLog: false
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
    switchLogoLog(state) {
      state.showLogoLog = !state.showLogoLog;
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
    getUserInfo({ commit, state }) {
      let c_start, c_end;
      if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf("avueUser=");
        if (c_start !== -1) {
          c_start = c_start + "avueUser=".length;
          c_end = document.cookie.indexOf(";", c_start);
          if (c_end === -1) c_end = document.cookie.length;
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
    }
  }
});
