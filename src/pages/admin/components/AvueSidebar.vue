<template>
  <el-menu
    v-if="$store.state.sidebar != null"
    :default-active="currentComponent"
    :collapse="isCollapse"
    router
  >
    <el-tooltip
      effect="dark"
      placement="right"
      :content="isCollapse ? '展开' : '折叠'"
    >
      <li class="el-submenu">
        <div class="el-submenu__title sidebar-switch" @click="sidebarSwitch">
          <i
            class="el-icon-d-arrow-left"
            :class="isCollapse ? 'i-flod' : 'i-no-flod'"
          ></i>
        </div>
      </li>
    </el-tooltip>
    <div v-for="(item, index) in $store.state.sidebar" :key="index">
      <el-submenu
        v-if="'item' in item && item.show"
        :index="subMenuIndex(index)"
      >
        <template slot="title">
          <i :class="item.class"></i
          ><span v-if="!isCollapse" slot="title">{{ item.title }}</span>
        </template>
        <div v-for="(subItem, subIndex) in item.item" :key="subIndex">
          <el-menu-item
            v-if="$store.state.selectAuthority[subItem.show]"
            :index="subItem.href"
            @click="switchTab(subItem)"
          >
            {{ subItem.title }}
          </el-menu-item>
        </div>
      </el-submenu>
      <el-menu-item
        v-else-if="item.show"
        :index="item.href"
        @click="switchTab(item)"
      >
        <i :class="item.class"></i><span slot="title">{{ item.title }}</span>
      </el-menu-item>
    </div>
  </el-menu>
</template>

<script>
import { Menu, MenuItem, Submenu, Tooltip } from "element-ui";

export default {
  name: "avueSidebar",
  components: {
    elMenu: Menu,
    elMenuItem: MenuItem,
    elSubmenu: Submenu,
    elTooltip: Tooltip
  },
  props: {
    currentComponent: String,
    isCollapse: Boolean
  },
  data() {
    return {
      isCheckAuthority: false,
      checkResult: false
    };
  },
  created() {
    let that = this;
    this.$store.dispatch("getItems", {
      url: this.$store.state.getSelectAuthority,
      query: {
        token: this.$store.state.userInfo.token
      },
      cb(res) {
        if (res.code === 200) {
          that.$store.commit("setSelectAuthority", res.data);
        }
      }
    });
  },
  methods: {
    subMenuIndex(index) {
      return index.toString();
    },
    sidebarSwitch() {
      this.$emit("sidebarswitch");
    },
    switchTab(item) {
      this.$emit("switchtab", item);
    }
  }
};
</script>

<style lang="less" scoped>
.flod-animate(@begin, @end, @name) {
  @keyframes @name {
    from {
      transform: rotate(@begin);
    }
    to {
      transform: rotate(@end);
    }
  }
}
.flod-animate(0, 180deg, flod);
.flod-animate(180deg, 360deg, no-flod);
.sidebar-switch {
  i {
    color: white;
    display: inline-block;
    animation: no-flod 0.3s forwards;
    &.i-flod {
      animation: flod 0.3s forwards;
    }
  }
}
</style>
