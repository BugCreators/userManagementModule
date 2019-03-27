<template>
  <div class="changePw" :class="!isAdmin? 'pdt-hh' : 'mg--20'">
    <el-breadcrumb v-if="!isAdmin" separator=">" class="bread">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>修改密码</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="changePw-page">
      <div class="changePw-main">
        <el-form label-position="left" :model="password">
          <el-form-item v-for="item in i18n" :key="item.index" :label="item.cn">
            <el-input v-model="password[item.en]" show-password></el-input>
            <span class="errorMsg">{{ item.errorMsg }}</span>
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
import { Breadcrumb, BreadcrumbItem, Button, Form, FormItem, Input, Message, MessageBox } from "element-ui";
import md5 from "md5";

export default {
  name: "changePassword",
  components: {
    elBreadcrumb: Breadcrumb,
    elBreadcrumbItem: BreadcrumbItem,
    elButton: Button,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input
  },
  data() {
    return {
      password: {
        oldPw: "",
        newPw: "",
        confirmPw: ""
      },
      i18n: [
        {
          en: "oldPw",
          cn: "旧密码",
          errorMsg: ""
        },
        {
          en: "newPw",
          cn: "新密码",
          errorMsg: ""
        },
        {
          en: "confirmPw",
          cn: "确认密码",
          errorMsg: ""
        }
      ]
    }
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
  },
  methods: {
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
              that.changePw();
              break;
          }
        }
      });
    },
    changePw() {
      if (this.password.oldPw === "") {
        this.i18n[0].errorMsg = "旧密码不能为空！";
        return;
      }
      this.i18n[0].errorMsg = "";

      if (this.password.newPw === "") {
        this.i18n[1].errorMsg = "密码不能为空！";
        return;
      }
      this.i18n[1].errorMsg = "";

      if (this.password.newPw !== this.password.confirmPw) {
        this.i18n[2].errorMsg = "两次密码不一致！";
      }
      this.i18n[2].errorMsg = "";

      let that = this;
      this.$store.dispatch("postItems", {
        url: this.$store.state.changePasswordByUser,
        query: {
          oldPw: md5(this.password.oldPw),
          newPw: md5(this.password.newPw),
          confirmPw: md5(this.password.confirmPw),
          number: this.$store.state.userInfo.number,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            Message.success(res.msg);
          } else if (res.code === 402) {
            that.$store.dispatch("clearUserInfo").then(() => {
              that.$store.commit("clearUserInfo");
            });
            MessageBox.confirm(
              "会话已过期，要进行操作请重新登陆！",
              "会话过期",
              {
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
              }
            );
          } else {
            Message.error(res.msg);
          }
        }
      })

    }
  }
};
</script>

<style lang="less" scoped>
.changePw {
  &-page {
    background: white;
    padding: 30px 0 100px;
  }
  &-main {
    margin: 0 auto;
    width: 1200px;
    .el-input {
      width: 30%;
    }
  }
}
.errorMsg {
  margin-left: 10px;
}
</style>