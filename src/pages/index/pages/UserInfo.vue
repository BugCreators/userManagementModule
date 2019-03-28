<template>
  <div class="userInfo" :class="!isAdmin ? 'pdt-hh' : 'mg--20'">
    <el-breadcrumb v-if="!isAdmin" separator=">" class="bread">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="userInfo-page">
      <div class="userInfo-main">
        <el-form label-position="left" :model="userInfo">
          <el-form-item v-for="item in i18n" :key="item.index" :label="item.cn">
            <el-input
              v-if="!item.radio"
              v-model="userInfo[item.en]"
              :disabled="item.disabled"
              :type="item.type"
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
          type: "textarea"
        }
      ]
    };
  },
  computed: {
    isAdmin() {
      if (location.href.indexOf("admin") != -1) {
        return true;
      }
      return false;
    }
  },
  created() {
    if (document.cookie.indexOf("avueUser=null") !== -1) {
      MessageBox.confirm("请先登录！", "提示", {
        cancelButtonText: "回到首页",
        confirmButtonText: "登录",
        type: "warning",
        callback(action) {
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
    getUserInfo() {
      let that = this;
      this.$store.dispatch("postItems", {
        url: this.$store.state.getUserInfo,
        query: {
          number: this.$store.state.userInfo.number,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            that.userInfo = res.data;
          } else if (res.code === 402) {
            that.reload();
          }
        }
      });
    },
    confirmChange() {
      let that = this;
      MessageBox.confirm("确定进行修改？", "确认修改", {
        type: "warning",
        callback(action) {
          switch (action) {
            default:
            case "cancel":
            case "close":
              Message.info("取消修改");
              break;
            case "confirm":
              that.changeInfoByUser();
              break;
          }
        }
      });
    },
    changeInfoByUser() {
      let that = this;
      this.$store.dispatch("postItems", {
        url: this.$store.state.changeUserInfoByUser,
        query: {
          number: this.userInfo.number,
          email: this.userInfo.email,
          sex: this.userInfo.sex,
          address: this.userInfo.address,
          description: this.userInfo.description,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            Message.success(res.msg);
          } else if (res.code === 402) {
            that.reload();
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    reload() {
      let that = this;
      this.$store.dispatch("clearUserInfo").then(() => {
        that.$store.commit("clearUserInfo");
      });
      MessageBox.confirm("会话已过期，要进行操作请重新登陆！", "会话过期", {
        cancelButtonText: "回到首页",
        confirmButtonText: "登录",
        type: "warning",
        callback(action) {
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

<style lang="less" scoped>
.userInfo {
  &-page {
    background: white;
    padding: 30px 0;
  }
  &-main {
    margin: 0 auto;
    width: 1200px;
    .el-input {
      width: 70%;
    }
  }
}
</style>
