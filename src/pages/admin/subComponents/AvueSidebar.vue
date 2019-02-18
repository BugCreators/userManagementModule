<template>
  <el-menu
    v-if="$store.state.sidebar != null"
    :default-active="currentComponent"
    :collapse="isCollapse"
    router
  >
    <div v-for="(item, index) in $store.state.sidebar" :key="index">
      <el-submenu v-if="'item' in item" :index="subMenuIndex(index)">
        <template slot="title">
          <i :class="item.class"></i><span slot="title">{{ item.title }}</span>
        </template>
        <el-menu-item
          v-for="(subItem, subIndex) in item.item"
          :key="subIndex"
          :index="subItem.href"
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
import { Menu, MenuItem, Submenu } from "element-ui";

export default {
  name: "avueSidebar",
  props: {
    currentComponent: String,
    isCollapse: Boolean
  },
  components: {
    elMenu: Menu,
    elMenuItem: MenuItem,
    elSubmenu: Submenu
  },
  created() {},
  methods: {
    subMenuIndex(index) {
      return index.toString();
    }
  }
};
</script>
