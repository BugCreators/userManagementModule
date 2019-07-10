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
          <div v-for="(item, index) in setting.systemWebsite" :key="index">
            <a target="_blank" :href="item.website">
              <span>{{ item.name }}</span>
            </a>
            <span v-if="index + 1 !== setting.systemWebsite.length">|</span>
          </div>
        </div>
        <div class="userInfo">
          <a
            class="loginButton"
            :href="buttonInfo.href"
            v-if="!userInfo"
            >{{ buttonInfo.text }}</a
          >
          <div v-else>
            欢迎您！{{ userInfo.roleName || "游客" }}
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ userInfo.realname
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="userInfo">个人信息</el-dropdown-item>
                <el-dropdown-item command="changePw">修改密码</el-dropdown-item>
                <div v-if="userInfo.intoBackstage">
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
import AvueImage from "../AvueImage/AvueImage";
import { Dropdown, DropdownMenu, DropdownItem } from "element-ui";
import { mapActions, mapState } from "vuex";

export default {
  name: "AvueHeader",
  components: {
    AvueImage,
    elDropdown: Dropdown,
    elDropdownMenu: DropdownMenu,
    elDropdownItem: DropdownItem
  },
  props: {
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (!this.isAdmin) {
      const navHeight = document.getElementsByClassName("header")[0].offsetHeight;
      onscroll = function() {
        const scrolltop =
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
    ...mapState(["userInfo", "setting"]),
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
      this.clearUserInfo();
      location.href = "index.html";
    }
  }
};
</script>

<style lang="less" src="./AvueHeader.less" scoped></style>
