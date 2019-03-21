<template>
  <div class="content">
    <div class="twoLoginMethods">
      <div class="logo-login">
        <img src="../../../assets/images/logo_home.png" />
      </div>
      <div class="loginBox">
        <div class="loginAccount">
          <p class="login-method">账号登录</p>
          <div class="has-padding">
            <div v-if="errMes" class="errMes">
              <img src="../../../assets/images/icon/popups_prompt.png" alt />
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
              >{{ logining == true ? "登陆中..." : "登 录" }}</el-button
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
      setting: "",
      isEncrypt: false,
      isShowPage: false
    };
  },
  created() {
    let that = this;
    new Promise(res => res())
      .then(() => that.getSetting())
      .then(() => {
        let userInfo = localStorage.getItem("avueUser");
        if (userInfo != null) {
          userInfo = JSON.parse(userInfo);
          (that.number = userInfo.number), (that.password = userInfo.password);
          that.remember = true;
          that.isEncrypt = true;
        }
        return true;
      });
  },
  watch: {
    password(newV, oldV) {
      if (oldV) this.isEncrypt = false;
    }
  },
  methods: {
    clickForgetPwd() {},
    getSetting() {
      let that = this;
      that.$store.dispatch("getItems", {
        url: this.$store.state.getSysSetting,
        cb(res) {
          that.setting = res.data;
          that.$store.commit("setSetting", that.setting);
        }
      });
    },
    login() {
      this.errMes = "";
      if (this.number == "") {
        this.errMes = "账号不能为空";
        return;
      }
      if (this.password == "") {
        this.errMes = "密码不能为空";
        return;
      }
      let that = this;
      this.logining = true;
      this.$store.dispatch("postItems", {
        url: this.$store.state.login,
        query: {
          number: this.number,
          password: that.isEncrypt ? this.password : md5(that.password)
        },
        cb(res) {
          if (res.code === 200) {
            /********** 记住密码 START ********/
            if (that.remember) {
              let obj = {
                number: that.number,
                password: that.isEncrypt ? that.password : md5(that.password)
              };
              let objStr = JSON.stringify(obj);
              localStorage.setItem("avueUser", objStr);
            } else {
              localStorage.removeItem("avueUser");
            }
            /************** END **************/
            let userObj = res.data;
            userObj.password = that.isEncrypt
              ? that.password
              : md5(that.password);
            let userInfo = JSON.stringify(userObj);
            document.cookie = "avueUser=" + encodeURIComponent(userInfo) + ";";

            let fromUrl = getUrlParam("fromUrl");
            if (fromUrl != "" && fromUrl != null) {
              location.href = fromUrl;
            } else {
              location = "index.html";
            }
          } else {
            that.logining = false;
            that.loading = false;
            that.errMes = res.msg;
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
.el-checkbox__inner::after {
  content: none;
}
.content {
  min-height: 894px;
  .twoLoginMethods {
    left: 50%;
    margin-left: -219px;
    position: absolute;
    top: 25%;
    width: 360px;
    .logo-login {
      margin-bottom: 50px;
      text-align: center;
    }
    .loginBox {
      background: #fff;
      border-radius: 6px;
      left: 39px;
      overflow: hidden;
      padding: 24px 24px 30px 24px;
      position: relative;
      .loginAccount {
        float: left;
        position: relative;
        width: 312px;
        &::after {
          background: #f2f2f2;
          content: "";
          display: inline-block;
          height: 240px;
          position: absolute;
          right: 88px;
          top: 36px;
          width: 0;
        }
        .login-method {
          color: @default_text_color;
          font-size: 20px;
          font-weight: bold;
          padding-bottom: 36px;
        }
        .has-padding {
          padding: 0 16px;
          .errMes {
            color: #ff6969;
            font-size: 12px;
            padding-bottom: 10px;
            span {
              padding-left: 8px;
              position: relative;
              top: 2px;
            }
          }
          .el-input {
            &.hasMargin {
              margin-bottom: 20px;
            }
            .el-input__inner {
              border-color: #dcdfe6;
              font-size: 16px;
              height: 50px;
              padding: 0 24px;
              width: 280px;
            }
          }
          .remember {
            padding-top: 18px;
            .el-checkbox__input {
              .el-checkbox__inner {
                border-color: #dcdfe6;
                border-radius: 2px;
                height: 18px;
                width: 18px;
              }
              &.is-checked {
                .el-checkbox__inner {
                  background-color: @default_color;
                  border-color: @default_color;
                  &::after {
                    border: 2px solid #fff;
                    border-left: 0;
                    border-top: 0;
                    box-sizing: content-box;
                    content: "";
                    height: 8px;
                    left: 5px;
                    position: absolute;
                    transform: rotate(45deg) scaleY(1);
                    top: 1px;
                    width: 4px;
                  }
                }
              }
            }
            .el-checkbox__label {
              color: #999;
              font-size: 16px;
              padding-left: 5px;
              position: relative;
              top: 1px;
            }
            a {
              color: @default_color;
              float: right;
              font-size: 16px;
              text-decoration: none;
            }
          }
          .el-button {
            background: @default_color;
            border-color: @default_color;
            color: #fff !important;
            font-size: 16px;
            height: 50px;
            margin-top: 60px;
            width: 100%;
            &.noClick {
              background: #c1e8d1 !important;
              border-color: #c1e8d1 !important;
            }
          }
        }
      }
    }
  }
}
</style>
