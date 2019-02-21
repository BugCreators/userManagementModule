<template>
  <div class="admin">
    <AvueHeader :isAdmin="true" />
    <div class="content">
      <div class="sidebar">
        <AvueSidebar
          :isCollapse="isCollapse"
          :currentComponent="currentComponent"
          @sidebarswitch="sidebarswitch"
        />
      </div>
      <div
        class="content-right"
        :class="isCollapse ? 'content-right-fold' : ''"
      >
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
      isCollapse: null
    };
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
  created() {
    let isCollapse = localStorage.getItem("isCollapse");
    if (isCollapse != null) {
      this.isCollapse = isCollapse === "true" ? true : false;
    } else {
      this.isCollapse = false;
    }
    window.addEventListener("beforeunload", this.loadStore);
  },
  methods: {
    sidebarswitch() {
      this.isCollapse = !this.isCollapse;
    },
    loadStore() {
      localStorage.setItem("isCollapse", this.isCollapse);
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
  ul {
    height: 100%;
    position: fixed;
  }
}
.content-right {
  overflow: hidden;
  transition: all 0.43s;
  margin-left: @sidebar_width;
  width: ~"calc(100% - @{sidebar_width})";
  &-fold {
    margin-left: @sidebar_width_fold;
    width: ~"calc(100% - @{sidebar_width_fold})";
  }
}
</style>
