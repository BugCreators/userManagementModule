<template>
  <div class="content">
    <div class="twoLoginMethods">
      <div class="logo-login">
        <img src="../../../../assets/images/default/logo.png" />
      </div>
      <div class="loginBox">
        <div class="loginAccount">
          <p class="login-method">账号登录</p>
          <div class="has-padding">
            <div v-if="errMes" class="errMes">
              <img src="../../../../assets/images/icon/popups_prompt.png" alt />
              <span>{{ errMes }}</span>
            </div>
            <el-input
              type="text"
              class="hasMargin"
              v-model="number"
              placeholder="点击输入您的账号"
              @keyup.enter.native="login"
              clearable
            ></el-input>
            <el-input
              type="password"
              class="password"
              v-model="password"
              placeholder="点击输入密码"
              @keyup.enter.native="login"
              clearable
            ></el-input>
            <div class="remember">
              <el-checkbox v-model="remember">记住密码</el-checkbox>
              <a href="#" class="forget" @click="clickForgetPwd">忘记密码？</a>
            </div>
            <el-button
              @click="login"
              :disabled="!number || !password"
              :class="{ noClick: !number || !password }"
              >{{ logining ? "登陆中..." : "登 录" }}</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Input, Checkbox, Button } from "element-ui";
import md5 from "md5";
import { getUrlParam } from "@/assets/js/tool";
import { mapMutations } from "vuex";

export default {
  name: "loginFrame",
  components: {
    elInput: Input,
    elCheckbox: Checkbox,
    elButton: Button
  },
  data() {
    return {
      number: "",
      password: "",
      errMes: "",
      remember: "",
      logining: false,
      userInfo: {},
      isEncrypt: false,
      isShowPage: false
    };
  },
  async created() {
    await this.getSetting();
    let userInfo = localStorage.getItem("avueUser");
    if (userInfo != null) {
      userInfo = JSON.parse(userInfo);
      this.number = userInfo.number;
      this.password = userInfo.password;
      this.remember = true;
      this.isEncrypt = true;
    }
  },
  watch: {
    password(newV, oldV) {
      if (oldV) this.isEncrypt = false;
    }
  },
  methods: {
    ...mapMutations(["setSetting"]),
    clickForgetPwd() {},
    async getSetting() {
      const { data: res } = await this.$http.getSysSetting();
      this.setSetting(res.data);
    },
    async login() {
      this.errMes = "";
      if (this.number === "") {
        this.errMes = "账号不能为空";
        return;
      }
      if (this.password === "") {
        this.errMes = "密码不能为空";
        return;
      }
      this.logining = true;
      const password = this.isEncrypt ? this.password : md5(this.password);
      const { data: res } = await this.$http.login({
        number: this.number,
        password
      });
      if (res.code === 200) {
        /********** 记住密码 START ********/
        if (this.remember) {
          const obj = {
            number: this.number,
            password
          };
          const objStr = JSON.stringify(obj);
          localStorage.setItem("avueUser", objStr);
        } else {
          localStorage.removeItem("avueUser");
        }
        /************** END **************/
        const { data: userObj } = res;
        userObj.password = password;
        const userInfo = JSON.stringify(userObj);
        document.cookie = "avueUser=" + encodeURIComponent(userInfo) + ";";

        const fromUrl = getUrlParam("fromUrl");
        if (fromUrl != "" && fromUrl != null) {
          location.href = fromUrl;
        } else {
          location = "index.html";
        }
      } else {
        this.logining = false;
        this.loading = false;
        this.errMes = res.msg;
      }
    }
  }
};
</script>

<style lang="less" src="./LoginFrame.less"></style>
