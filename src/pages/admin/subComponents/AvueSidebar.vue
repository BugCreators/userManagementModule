<template>
  <div>
    <el-menu 
      v-if="$store.state.sidebar != null" 
      :default-active="currentComponent" 
      router
    >
      <el-menu-item 
        v-for="(item, index) in $store.state.sidebar"
        :index="item.href"
        :key="index"
      >
        <span><i :class="item.class"></i>{{ item.title }}</span>
      </el-menu-item>
    </el-menu>
  </div>  
</template>

<script>
import { Menu, MenuItem } from "element-ui";

export default {
  name: "avueSidebar",
  components: {
    elMenu: Menu,
    elMenuItem: MenuItem
  },
  props: {
    currentComponent: String
  },
  created() {}
};
</script>

<style lang="less" scoped>
</style>
