<template>
  <div class="admin">
    <AvueHeader :isAdmin="true" />
    <div class="content">
      <div class="sidebar">
        <div :class="isCollapse ? `sidebar-width-fold` : ``">
          <AvueSidebar :isCollapse="isCollapse" :currentComponent="currentComponent" />
        </div>
      </div>
      <div class="displaySidebar" @click="sidebarSwitch">
        <i class="el-icon-caret-left"></i>
      </div>
      <div class="content-right" :class="isCollapse ? `content-right-fold` : ``">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import AvueHeader from "@/components/AvueHeader";
import AvueSidebar from "./subComponents/AvueSidebar";

export default {
  name: "admin",
  components: {
    AvueHeader,
    AvueSidebar
  },
  data() {
    return {
      isCollapse: false
    }
  },
  computed: {
    // 获取当前组件名
    currentName() {
      let currentLocation = window.location.href.split("/");
      return currentLocation[currentLocation.length - 1];
    },
    currentComponent() {
      return this.currentName == "" ? "collegeManagement" : this.currentName;
    }
  },
  methods: {
    sidebarSwitch() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="less" scoped>
.content {
  height: 100%;
  padding-top: @header_height;
}
.sidebar {
  background: @header_bg;
  height: ~"calc(100% - @{header_height})";
  width: @sidebar_width;
  &-fold {
    width: @sidebar_width_fold;
  }
  &, &-fold {
    ul {
      height: 100%;
      position: fixed;
    }
  }
}
.displaySidebar{
  bottom: 0;
  left: 200px;
  height: 100%;
  position: absolute;
  top: 0;
  width: 0px;
  z-index: 10;
  i {
    display: block;
    outline: none;
    position: absolute;
    top: 50%;
    width: 17px;
    &:active {
      // transform: rotate(2deg);
    }
  }
}
.content-right {
  overflow: hidden;
  transition: all .3s;
    margin-left: @sidebar_width;
    width: ~"calc(100% - @{sidebar_width})";
    &-fold {
      margin-left: @sidebar_width_fold;
      width: ~"calc(100% - @{sidebar_width_fold})";
    }
}
</style>
