<template>
  <div class="admin">
    <AvueHeader :isAdmin="true"/>
    <el-row class="content">
      <el-col 
        class="sidebar"
        :xs="4"
        :sm="4"
        :lg="3"
      >
        <AvueSidebar :currentComponent="currentComponent"/>
      </el-col>
      <el-col  
        class="page-right"
        :xs="20"
        :sm="20"
        :lg="21"
      >
        <RouterView />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AvueHeader from "@/components/AvueHeader";
import { Row, Col } from "element-ui";
import AvueSidebar from "./subComponents/AvueSidebar";

export default {
  name: "admin",
  components: {
    AvueHeader,
    elRow: Row,
    elCol: Col,
    AvueSidebar
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
  }
};
</script>

<style lang="less" scoped>
.admin {
  height: 100%;
  .content {
    box-sizing: content-box;
    height: 100%;
    padding-top: @header_height;
    .sidebar {
      background: @header_bg;
      height: ~"calc(100% - @{header_height})";
      position: fixed;
    }
    .page-right {
      margin-left: 12.5%;
    }
  }
}
</style>
