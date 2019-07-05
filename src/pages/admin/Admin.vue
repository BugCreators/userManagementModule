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
import AvueHeader from "@/components/AvueHeader/AvueHeader";
import AvueSidebar from "./components/AvueSidebar/AvueSidebar";
import { Loading, Tabs, TabPane } from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import { mapActions, mapState } from "vuex";

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
      isCollapse: null
    };
  },
  computed: {
    ...mapState({
      token: state => state.userInfo.token
    }),
    currentName() {
      return this.$route.name;
    },
    currentComponent() {
      return this.currentName === "admin" ? "/" : this.currentName;
    }
  },
  async created() {
    if (document.cookie.indexOf("avueUser=null") !== -1) {
      avueMsgBox(
        {
          message: "请先登录！"
        },
        1
      )
        .then(() => (location.href = "login.html"))
        .catch(() => (location.href = "index.html"));
    }
    await this.getUserInfo();
    this.getBackIntoBackstage();
  },
  mounted() {
    const isCollapse = localStorage.getItem("isCollapse"),
      editableTabs = localStorage.getItem("currentPageTab"),
      editableTabsValue = localStorage.getItem("currentPageActive");
    this.editableTabs = editableTabs
      ? JSON.parse(editableTabs)
      : this.editableTabs;
    this.editableTabsValue = editableTabsValue || this.editableTabsValue;
    this.switchComponents({
      name: this.editableTabsValue
    });
    this.isCollapse = isCollapse === "true" ? true : false;
    window.addEventListener("beforeunload", this.loadStore);
  },
  methods: {
    ...mapActions(["getUserInfo", "clearUserInfo"]),
    async getBackIntoBackstage() {
      const loading = Loading.service();
      const { data: res } = await this.$http.intoBackstage({
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        if (res.data.intoBackstage === 0) {
          avueMsgBox(
            {
              message: "你没有足够的权限进入后台"
            },
            2
          ).then(() => (location.href = "index.html"));
        }
      } else {
        this.clearUserInfo();
        avueMsgBox(
          {
            message: res.msg
          },
          2
        ).then(() => (location.href = "index.html"));
      }
    },
    sidebarswitch() {
      this.isCollapse = !this.isCollapse;
    },
    loadStore() {
      localStorage.setItem("currentPageTab", JSON.stringify(this.editableTabs));
      localStorage.setItem("currentPageActive", this.editableTabsValue);
      localStorage.setItem("isCollapse", this.isCollapse);
    },
    addTab(item) {
      const newTabName = Math.floor(Math.random() * 10000000) + "";
      this.editableTabs.push({
        closable: "closable",
        title: item.title,
        name: newTabName,
        href: item.href
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      const tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
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
        activeName;
      const tabs = this.editableTabs;
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
      const tabs = this.editableTabs;
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

<style lang="less" src="./Admin.less" scoped></style>
