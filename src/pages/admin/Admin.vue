<template>
  <div class="admin">
    <AvueHeader :isAdmin="true" />
    <div class="content">
      <div class="sidebar">
        <AvueSidebar
          :isCollapse="isCollapse"
          :currentComponent="currentComponent"
          @sidebarswitch="sidebarswitch"
          @switchtab="switchtab"
        />
      </div>
      <el-tabs
        class="content-right"
        type="card"
        v-model="editableTabsValue"
        :class="isCollapse ? 'content-right-fold' : ''"
        @tab-click="switchComponents"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="item in editableTabs"
          :key="item.name"
          :closable="item.closable"
          :label="item.title"
          :name="item.name"
          lazy
        >
        </el-tab-pane>
        <RouterView />
      </el-tabs>
    </div>
  </div>
</template>

<script>
import AvueHeader from "@/components/AvueHeader";
import AvueSidebar from "./components/AvueSidebar";
import { Tabs, TabPane } from "element-ui";

export default {
  name: "admin",
  components: {
    AvueHeader,
    AvueSidebar,
    elTabs: Tabs,
    elTabPane: TabPane
  },
  data() {
    return {
      editableTabs: [
        {
          title: "我的桌面",
          name: "1",
          href: "/"
        }
      ],
      editableTabsValue: "1",
      isCollapse: null,
      // tabIndex: 1
    };
  },
  computed: {
    currentName() {
      return this.$route.name;
    },
    currentComponent() {
      return this.currentName == "admin" ? "/" : this.currentName;
    },
    tabIndex() {
      return Math.floor(Math.random() * 10000000);
    }
  },
  created() {
    let isCollapse = localStorage.getItem("isCollapse");
    editableTabs = JSON.parse(localStorage.getItem("currentPageTab")); 
    editableTabsValue = localStorage.getItem("currentPageActive");
    this.editableTabs = editableTabs.length > 0 ? this.editableTabs : editableTabs;
    this.editableTabsValue = editableTabsValue.length > 0 ? this.editableTabsValue : editableTabsValue;
    this.switchComponents({
      name: this.editableTabsValue
    });
    if (isCollapse) {
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
      localStorage.setItem("currentPageTab", JSON.stringify(this.editableTabs));
      localStorage.setItem("currentPageActive", this.editableTabsValue);
      localStorage.setItem("isCollapse", this.isCollapse);
    },
    addTab(item) {
      // let newTabName = this.tabIndex + "";
      let newTabName = Math.floor(Math.random() * 10000000) + "";
      this.editableTabs.push({
        closable: "closable",
        title: item.title,
        name: newTabName,
        href: item.href
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs,
        activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      this.switchComponents({
        name: activeName
      });
    },
    switchtab(item) {
      let tabExisted = true,
        tabs = this.editableTabs;
      let activeName;
      tabs.map(tab => {
        if (tab.title === item.title) {
          tabExisted = false;
          activeName = tab.name;
          return;
        }
      });
      if (tabExisted) {
        this.addTab(item);
      } else {
        this.editableTabsValue = activeName;
      }
    },
    switchComponents(item) {
      let tabs = this.editableTabs;
      let switchPath;
      tabs.map(tab => {
        if (tab.name === item.name) {
          switchPath = tab.href;
          return;
        }
      });
      this.$router.push({ path: switchPath });
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
  position: relative;
  width: @sidebar_width;
  z-index: 999;
  ul {
    height: 100%;
    position: fixed;
  }
}
.content-right {
  margin-left: @sidebar_width;
  overflow: hidden;
  transition: all 0.4s;
  width: ~"calc(100% - @{sidebar_width})";
  &-fold {
    margin-left: @sidebar_width_fold;
    width: ~"calc(100% - @{sidebar_width_fold})";
  }
}
</style>
