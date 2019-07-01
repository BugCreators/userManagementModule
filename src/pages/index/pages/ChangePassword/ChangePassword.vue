<template>
  <div class="changePw" :class="!isAdmin ? 'pdt-hh' : 'mg--20'">
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
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormItem,
  Input,
  Message
} from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import md5 from "md5";
import { mapState, mapActions, mapMutations } from "vuex";

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
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    }),
    isAdmin() {
      return location.href.indexOf("admin") != -1;
    }
  },
  created() {
    if (document.cookie.indexOf("avueUser=null") !== -1) {
      avueMsgBox(
        {
          message: "请先登录！"
        },
        1
      )
        .then(() => (location.href = "login.html"))
        .catch(() => (location.href = "index.html"));
    }
  },
  methods: {
    ...mapActions(["clearUserInfo"]),
    ...mapMutations({
      clearUserInfoM: "clearUserInfo"
    }),
    confirmChange() {
      avueMsgBox({
        message: "确定进行修改？"
      })
        .then(() => this.changePw())
        .catch(() => Message.info("取消修改"));
    },
    async changePw() {
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

      const { data: res } = await this.$http.changePasswordByUser({
        oldPw: md5(this.password.oldPw),
        newPw: md5(this.password.newPw),
        confirmPw: md5(this.password.confirmPw),
        number: this.userInfo.number,
        token: this.userInfo.token
      });
      if (res.code === 200) {
        Message.success(res.msg);
      } else if (res.code === 402) {
        await this.clearUserInfo();
        this.clearUserInfoM();
        avueMsgBox(
          {
            message: "会话已过期，要进行操作请重新登陆！"
          },
          1
        )
          .then(() => (location.href = "login.html"))
          .catch(() => (location.href = "index.html"));
      } else {
        Message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less" src="./ChangePassword.less" scoped></style>
