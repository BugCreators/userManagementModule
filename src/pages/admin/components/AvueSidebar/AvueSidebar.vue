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
        v-else-if="$store.state.selectAuthority[item.show] || !item.show"
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
import { mapState, mapActions, mapMutations } from "vuex";

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
  computed: {
    ...mapState({
      token: state => state.userInfo.token
    })
  },
  created() {
    this.getItems({
      url: this.$store.state.getSelectAuthority,
      query: {
        token: this.token
      },
      cb: res => {
        if (res.code === 200) {
          this.setSelectAuthority(res.data);
        }
      }
    });
  },
  methods: {
    ...mapActions(["getItems"]),
    ...mapMutations(["setSelectAuthority"]),
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

<style lang="less" src="./AvueSidebar.less" scoped></style>
