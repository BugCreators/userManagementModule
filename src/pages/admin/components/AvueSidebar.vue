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
      <el-submenu v-if="'item' in item" :index="subMenuIndex(index)">
        <template slot="title">
          <i :class="item.class"></i
          ><span v-if="!isCollapse" slot="title">{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="(subItem, subIndex) in item.item"
          :key="subIndex"
          :index="subItem.href"
          @click="switchTab(subItem)"
        >
          {{ subItem.title }}
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else :index="item.href">
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
