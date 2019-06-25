<template>
  <div class="userInfo" :class="!isAdmin ? 'pdt-hh' : 'mg--20'">
    <el-breadcrumb v-if="!isAdmin" separator=">" class="bread">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="userInfo-page">
      <div :class="!isAdmin ? 'userInfo-main' : 'userInfo-admin'">
        <el-form label-position="left" :model="userInfo">
          <el-form-item v-for="item in i18n" :key="item.index" :label="item.cn">
            <el-input
              v-if="!item.radio"
              v-model="userInfo[item.en]"
              :disabled="item.disabled"
              :type="item.type"
              :rows="item.rows"
            ></el-input>
            <div v-else>
              <el-radio
                v-for="(value, key) in item.label"
                v-model="userInfo[item.en]"
                :key="value"
                :label="value"
              >
                {{ key }}
              </el-radio>
            </div>
          </el-form-item>
          <div class="btns">
            <el-button type="primary" @click="confirmChange">修改</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormItem,
  Input,
  Message,
  MessageBox,
  Radio
} from "element-ui";
import { mapState, mapActions } from "vuex";

export default {
  name: "userInfo",
  components: {
    elBreadcrumb: Breadcrumb,
    elBreadcrumbItem: BreadcrumbItem,
    elButton: Button,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input,
    elRadio: Radio
  },
  data() {
    return {
      userInfo: {
        realname: "",
        number: "",
        college: "",
        class: "",
        email: "",
        sex: null,
        address: "",
        description: ""
      },
      i18n: [
        {
          en: "realname",
          cn: "姓名",
          disabled: true
        },
        {
          en: "number",
          cn: "学号",
          disabled: true
        },
        {
          en: "college",
          cn: "学院",
          disabled: true
        },
        {
          en: "class",
          cn: "班级",
          disabled: true
        },
        {
          en: "email",
          cn: "邮箱"
        },
        {
          en: "sex",
          cn: "性别",
          radio: true,
          label: {
            男: 1,
            女: 0
          }
        },
        {
          en: "address",
          cn: "地址"
        },
        {
          en: "description",
          cn: "个人描述",
          type: "textarea",
          rows: 10
        }
      ]
    };
  },
  computed: {
    ...mapState({
      token: state => state.userInfo.token
    }),
    isAdmin() {
      return location.href.indexOf("admin") != -1;
    }
  },
  created() {
    if (document.cookie.indexOf("avueUser=null") !== -1) {
      MessageBox.confirm("请先登录！", "提示", {
        cancelButtonText: "回到首页",
        confirmButtonText: "登录",
        type: "warning",
        callback: action => {
          switch (action) {
            case "cancel":
            case "close":
              location.href = "index.html";
              break;
            case "confirm":
              location.href = "login.html";
              break;
          }
        }
      });
    }
    this.getUserInfo();
  },
  methods: {
    ...mapActions(["postItems", "clearUserInfo"]),
    getUserInfo() {
      this.postItems({
        url: this.$store.state.getUserInfo,
        query: {
          number: this.$store.state.userInfo.number,
          token: this.token
        },
        cb: res => {
          if (res.code === 200) {
            this.userInfo = res.data;
          } else if (res.code === 402) {
            this.reload();
          }
        }
      });
    },
    confirmChange() {
      MessageBox.confirm("确定进行修改？", "确认修改", {
        type: "warning",
        callback: action => {
          switch (action) {
            default:
            case "cancel":
            case "close":
              Message.info("取消修改");
              break;
            case "confirm":
              this.changeInfoByUser();
              break;
          }
        }
      });
    },
    changeInfoByUser() {
      this.postItems({
        url: this.$store.state.changeUserInfoByUser,
        query: {
          number: this.userInfo.number,
          email: this.userInfo.email,
          sex: this.userInfo.sex,
          address: this.userInfo.address,
          description: this.userInfo.description,
          token: this.token
        },
        cb: res => {
          if (res.code === 200) {
            Message.success(res.msg);
          } else if (res.code === 402) {
            this.reload();
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    reload() {
      this.clearUserInfo().then(() => {
        this.$store.commit("clearUserInfo");
      });
      MessageBox.confirm("会话已过期，要进行操作请重新登陆！", "会话过期", {
        cancelButtonText: "回到首页",
        confirmButtonText: "登录",
        type: "warning",
        callback: action => {
          switch (action) {
            case "cancel":
            case "close":
              location.href = "index.html";
              break;
            case "confirm":
              location.href = "login.html";
              break;
          }
        }
      });
    }
  }
};
</script>

<style lang="less" src="./UserInfo.less" scoped></style>
