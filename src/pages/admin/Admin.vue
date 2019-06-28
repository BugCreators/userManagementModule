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
import { Loading, MessageBox, Tabs, TabPane } from "element-ui";
import { mapMutations, mapActions, mapState } from "vuex";

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
    currentComponent: {
      get() {
        return this.currentName == "admin" ? "/" : this.currentName;
      },
      set(value) {
        return value;
      }
    },
    tabIndex() {
      return Math.floor(Math.random() * 10000000);
    }
  },
  async created() {
    if (document.cookie.indexOf("avueUser=null") !== -1) {
      MessageBox.confirm("请先登录！", "提示", {
        cancelButtonText: "回到首页",
        confirmButtonText: "登录",
        type: "warning",
        callback: action => {
          switch (action) {
            case "cancel":
            case "close":
              location.href = "index.html";
              break;
            case "confirm":
              location.href = "login.html";
              break;
          }
        }
      });
    }
    await this.getUserInfo();
    this.getBackIntoBackstage();
  },
  mounted() {
    let isCollapse = localStorage.getItem("isCollapse"),
      editableTabs = localStorage.getItem("currentPageTab"),
      editableTabsValue = localStorage.getItem("currentPageActive");
    this.editableTabs = editableTabs
      ? JSON.parse(editableTabs)
      : this.editableTabs;
    this.editableTabsValue = editableTabsValue
      ? editableTabsValue
      : this.editableTabsValue;
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
    ...mapActions(["getUserInfo", "clearUserInfo"]),
    ...mapMutations({
      clearUserInfoM: "clearUserInfo"
    }),
    async getBackIntoBackstage() {
      let loading = Loading.service();
      const { data: res } = await this.$http.intoBackstage({
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        if (res.data.intoBackstage === 0) {
          MessageBox.alert("你没有足够的权限进入后台", "提示", {
            confirmButtonText: "确定",
            type: "warning",
            callback() {
              location.href = "index.html";
            }
          });
        }
      } else {
        await this.clearUserInfo();
        this.clearUserInfoM();
        MessageBox.alert(res.msg, "提示", {
          confirmButtonText: "确定",
          type: "warning",
          callback() {
            location.href = "index.html";
          }
        });
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

<style lang="less" src="./Admin.less" scoped></style>
