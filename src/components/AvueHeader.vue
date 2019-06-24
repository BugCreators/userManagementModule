<template>
  <div class="header">
    <div :class="isAdmin ? 'container-admin' : 'container'">
      <h1 class="logo">
        <a :href="isAdmin ? 'admin.html' : 'index.html'">
          <AvueImage
            :srcImage="
              isAdmin ? $store.state.adminLogo : $store.state.defaultLogo
            "
            :replaceImage="$store.state.defaultLogo"
          />
        </a>
      </h1>
      <div class="header-right">
        <div class="otherSystem">
          <div
            v-for="(item, index) in $store.state.setting.systemWebsite"
            :key="index"
          >
            <a target="_blank" :href="item.website">
              <span>{{ item.name }}</span>
            </a>
            <span v-if="index + 1 != $store.state.setting.systemWebsite.length"
              >|</span
            >
          </div>
        </div>
        <div class="userInfo">
          <a
            class="loginButton"
            :href="buttonInfo.href"
            v-if="!$store.state.userInfo"
            >{{ buttonInfo.text }}</a
          >
          <div v-else>
            欢迎您！{{ $store.state.userInfo.roleName || "游客" }}
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ $store.state.userInfo.realname
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                <el-dropdown-item command="changePw">修改密码</el-dropdown-item>
                <div v-if="$store.state.userInfo.intoBackstage">
                  <el-dropdown-item v-if="!isAdmin" command="userManagement"
                    >用户管理</el-dropdown-item
                  >
                  <el-dropdown-item command="index" v-else
                    >回到首页</el-dropdown-item
                  >
                </div>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AvueImage from "./AvueImage.vue";
import { Dropdown, DropdownMenu, DropdownItem } from "element-ui";
import { mapActions } from "vuex";

export default {
  name: "AvueHeader",
  components: {
    AvueImage,
    elDropdown: Dropdown,
    elDropdownMenu: DropdownMenu,
    elDropdownItem: DropdownItem
  },
  props: {
    isAdmin: Boolean
  },
  mounted() {
    if (!this.isAdmin) {
      let navHeight = document.getElementsByClassName("header")[0].offsetHeight;
      onscroll = function() {
        let scrolltop =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (scrolltop > navHeight) {
          document.querySelector(".header").classList.add("headerScroll");
        } else {
          document.querySelector(".header").classList.remove("headerScroll");
        }
      };
    }
  },
  computed: {
    buttonInfo() {
      return location.pathname === "/login.html"
        ? {
            href: "index.html",
            text: "回到首页"
          }
        : {
            href: "login.html",
            text: "登陆"
          };
    }
  },
  methods: {
    ...mapActions(["clearUserInfo"]),
    handleCommand(command) {
      switch (command) {
        case "userInfo":
          this.$router.push({
            path: "/userInfo"
          });
          break;
        case "changePw":
          this.$router.push({
            path: "/changePw"
          });
          break;
        case "userManagement":
          location.href = "admin.html";
          break;
        case "index":
          location.href = "index.html";
          break;
        case "logout":
          this.logout();
          break;
      }
    },
    logout() {
      this.clearUserInfo().then(() => {
        this.$store.commit("clearUserInfo");
      });
      location.href = "index.html";
    }
  }
};
</script>

<style lang="less" scoped>
.header {
  background: @header_bg;
  height: @header_height;
  position: fixed;
  width: 100%;
  z-index: 1999;
  .container {
    margin: 0 auto;
    padding: 0;
    width: @content_width;
  }
  .container-admin {
    padding: 0 20px;
  }
  .logo {
    float: left;
    margin: 10px 0 0 0 !important;
    img {
      width: auto;
    }
  }
  .header-right {
    float: right;
    color: white;
    a {
      color: white;
    }
    div {
      display: inline-block;
    }
  }
  .otherSystem {
    display: inline-block;
    margin-right: 20px;
    span {
      margin-right: 10px;
    }
  }
  .userInfo {
    display: inline-block;
    &,
    .el-dropdown,
    .loginButton {
      color: white;
      font-size: 16px;
      line-height: 3.5;
    }
    .el-dropdown-menu__item {
      color: @default_color;
    }
  }
}
.headerScroll {
  background: url("../assets/images/nav_bg_scroll.png") 0 -20px repeat-x;
}
</style>
