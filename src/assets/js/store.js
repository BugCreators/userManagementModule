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
    // defaultCollegeDetail: require (`../images/default/college_detail.png`),
    defaultBanner: require(`../images/default/banner.png`),
    defaultNoData: require(`../images/NoData.png`),
    // 用户信息
    userInfo: ``,
    // number: ``,
    // password: ``,
    // realname: ``,
    // intoBackstage: ``,
    // token: ``,
    // roleName: ``,
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
            title: "学系机构",
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

    // 上传院徽
    showLogoLog: false,

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
    /**************管理员管理*****************/
    // 部门管理
    // 部门列表
    getBranchList: baseUrl + `/api/branch/getBranchList`,
    // 导出数据 全部部门
    getAllBranchList: baseUrl + `/api/branch/getAllBranchList`,
    // 部门详情
    getBranchDetail: baseUrl + `/api/branch/getBranchDetail`,
    // 添加部门
    addBranch: baseUrl + `/api/branch/addBranch`,
    // 删除部门
    delBranch: baseUrl + `/api/branch/deleteBranch`,
    // 批量添加
    importBranchList: baseUrl + `/api/branch/importBranchList`,
    // 修改部门
    changeBranch: baseUrl + `/api/branch/changeBranch`,

    // 角色管理
    // 角色列表
    getRoleList: baseUrl + `/api/role/getRoleList`,
    // 角色详情
    getRoleDetail: baseUrl + `/api/role/getRoleDetail`,
    // 修改角色
    changeRole: baseUrl + `/api/role/changeRole`,
    // 获取模块列表
    getModuleList: baseUrl + `/api/role/getModuleList`,
    // 添加角色
    addRole: baseUrl + `/api/role/addRole`,
    // 删除角色
    delRoles: baseUrl + `/api/role/deleteRole`,

    // 权限列表
    getAuthorityList: baseUrl + `/api/authority/getAuthorityList`,

    /*****************END********************/
    /***************院系管理*****************/
    // 学院管理
    // 学院列表
    getCollegeListByAdmin: baseUrl + `/api/college/getCollegeListByAdmin`,
    // 导出数据 全部学院
    getAllCollegeList: baseUrl + `/api/college/getAllCollegeList`,
    // 学院详情
    getCollegeDetailByAdmin: baseUrl + `/api/college/getCollegeDetailByAdmin`,
    // 院徽
    getCollegeLogo: baseUrl + `/api/college/getCollegeLogo`,
    // 上传院徽
    changeCollegeLogo: baseUrl + `/api/college/changeCollegeLogo`,
    // 删除院徽
    deleteCollegeLogo: baseUrl + `/api/college/deleteCollegeLogo`,
    // 添加学院
    addCollege: baseUrl + `/api/college/addCollege`,
    // 删除学院
    delCollege: baseUrl + `/api/college/deleteCollege`,
    // 批量添加
    importCollegeList: baseUrl + `/api/college/importCollegeList`,
    // 修改学院
    changeCollege: baseUrl + `/api/college/changeCollegeDetail`,

    // 院系管理
    // 院系列表
    getDepartmentList: baseUrl + `/api/department/getDepartmentList`,
    // 导出数据 全部院系
    getAllDepartmentList: baseUrl + `/api/department/getAllDepartmentList`,
    // 院系详情
    getDepartmentDetail: baseUrl + `/api/department/getDepartmentDetail`,
    // 修改院系
    changeDepartment: baseUrl + `/api/department/changeDepartment`,
    // 添加院系
    addDepartment: baseUrl + `/api/department/addDepartment`,
    // 删除学院:
    delDepartments: baseUrl + `/api/department/deleteDepartments`,
    // 批量添加
    importDepartmentList: baseUrl + `/api/department/importDepartmentList`,
    // 获取院系列表（根据学院ID）
    getDepartmentListByCollegeId:
      baseUrl + `/api/department/getDepartmentListByCollegeId`,

    // 专业管理
    // 学院列表
    getMajorList: baseUrl + `/api/major/getMajorList`,
    // 导出数据 全部专业
    getAllMajorList: baseUrl + `/api/major/getAllMajorList`,
    // 专业详情
    getMajorDetail: baseUrl + `/api/major/getMajorDetail`,
    // 添加专业
    addMajor: baseUrl + `/api/major/addMajor`,
    // 删除专业
    delMajors: baseUrl + `/api/major/deleteMajor`,
    // 批量添加
    importMajorList: baseUrl + `/api/major/importMajorList`,
    // 修改专业
    changeMajor: baseUrl + `/api/major/changeMajor`,
    // 获取专业列表（根据学院ID）
    getMajorListBycollegeId: baseUrl + `/api/major/getMajorListByCollegeId`,

    // 班级管理
    getClassList: baseUrl + `/api/vclass/getClassList`,
    // 导出数据 全部班级
    getAllClassList: baseUrl + `/api/vclass/getAllClassList`,
    // 获取年级
    getGradeList: baseUrl + `/api/user/getGradeList`,
    // 班级详情
    getClassDetail: baseUrl + `/api/vclass/getClassDetail`,
    // 添加班级
    addClass: baseUrl + `/api/vclass/addClass`,
    // 删除班级
    delClass: baseUrl + `/api/vclass/deleteClass`,
    // 批量添加
    importClassList: baseUrl + `/api/vclass/importClassList`,
    // 修改班级
    changeClass: baseUrl + `/api/vclass/changeClass`,
    /*****************END*******************/

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
        .post(opts.url, opts.config ? opts.query : stringify(opts.query), {
          headers: {
            "Content-Type": opts.config
              ? opts.config.headers
              : "application/x-www-form-urlencoded;charset=UTF-8"
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
    }
  }
});
