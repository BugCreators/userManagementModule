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
      this.commit("clearUserInfo");
    },
    setSearchValue(state, value) {
      state.searchValue = value;
    },
    setSetting(state, setting) {
      state.setting = setting;
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
    getUserInfo({ state }) {
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
