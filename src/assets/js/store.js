import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { stringify } from "qs";

Vue.use(Vuex);

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
    // 默认logo
    defaultLogo: require(`../images/default/logo.png`),
    // 默认头像
    defaultHeader: `/assets/images/default/head.png`,
    // 默认学院封面
    defaultCollege: require(`../images/default/college.png`),
    // defaultCollegeDetail: require (`../images/default/college_detail.png`),
    defaultBanner: require(`../images/default/banner.png`),
    defaultNoData: require(`../images/NoData.png`),
    // 用户信息
    userInfo: ``,

    token: ``,

    sidebar: [
      {
        name: "college",
        title: "学院管理",
        href: "collegeManagement"
      },
      {
        name: "partment",
        title: "系别管理",
        href: "departmentManagement"
      },
      {
        name: "class",
        title: "班级管理",
        href: "classManagement"
      },
      {
        name: "setting",
        title: "基本设置",
        class: "el-icon-setting",
        href: "setting"
      }
    ],
    /*******************网络接口*******************/
    // 系统设置
    getSysSetting: ``,
    // 学院列表
    getCollegeList: ``,
    // 学院详情 参数: id
    getCollegeDetail: ``,
    // 用户登录 参数：name, password
    login: ``
  },
  mutations: {
    setSetting(state, setting) {
      state.setting = setting;
    },
    clearUserInfo(state) {
      state.userInfo = ``;
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
      return axios.post(opts.url, stringify(opts.query)).then(
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
    postArrItems({ commit, stata }, opts) {
      axios
        .post(
          opts.url,
          stringify(opts.query, {
            indices: false
          })
        )
        .then(
          res => {
            opts.cb(res);
          },
          err => {
            console.log(err);
          }
        );
    },
    getUserInfo() {},
    clearUserInfo() {
      localStorage.token = ``;
    }
  }
});
