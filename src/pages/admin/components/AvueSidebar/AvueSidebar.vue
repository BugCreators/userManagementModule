<template>
  <el-menu
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
    <div v-for="(item, index) in sidebar" :key="index">
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
            v-if="selectAuthority[subItem.show]"
            :index="subItem.href"
            @click="switchTab(subItem)"
          >
            {{ subItem.title }}
          </el-menu-item>
        </div>
      </el-submenu>
      <el-menu-item
        v-else-if="selectAuthority[item.show] || !item.show"
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
import { mapState } from "vuex";

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
    isCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sidebar: [
        {
          name: "admin",
          title: "管理员管理",
          class: "el-icon-admin",
          show: false,
          item: [
            {
              name: "branch",
              title: "部门管理",
              href: "branch",
              show: "select_branch"
            },
            {
              name: "role",
              title: "角色管理",
              href: "role",
              show: "select_role"
            },
            {
              name: "authority",
              title: "权限列表",
              href: "authority",
              show: "select_authority"
            },
            {
              name: "administrator",
              title: "管理员列表",
              href: "administrator",
              show: "select_admin"
            }
          ]
        },
        {
          name: "depart",
          title: "学系管理",
          class: "el-icon-depart",
          show: false,
          item: [
            {
              name: "college",
              title: "学院管理",
              href: "college",
              show: "select_college"
            },
            {
              name: "department",
              title: "教学系别",
              href: "department",
              show: "select_department"
            },
            {
              name: "major",
              title: "专业管理",
              href: "major",
              show: "select_major"
            },
            {
              name: "class",
              title: "班级管理",
              href: "class",
              show: "select_class"
            }
          ]
        },
        {
          name: "userManagement",
          title: "账号管理",
          class: "el-icon-user",
          show: false,
          item: [
            {
              name: "student",
              title: "学生列表",
              href: "student",
              show: "select_student"
            },
            {
              name: "teacher",
              title: "教师列表",
              href: "teacher",
              show: "select_teacher"
            }
          ]
        },
        {
          name: "userInfo",
          title: "个人信息",
          class: "el-icon-edit-outline",
          href: "userInfo"
        },
        {
          name: "changePw",
          title: "修改密码",
          class: "el-icon-edit",
          href: "changePw"
        },
        {
          name: "setting",
          title: "基本设置",
          class: "el-icon-setting",
          show: "select_system_setting",
          href: "setting"
        }
      ],
      // 查询权限
      selectAuthority: {
        select_admin: 0,
        select_admin_department: 0,
        select_authority: 0,
        select_class: 0,
        select_college: 0,
        select_department: 0,
        select_major: 0,
        select_role: 0,
        select_student: 0,
        select_teacher: 0
      },
    }
  },
  computed: {
    ...mapState({
      token: state => state.userInfo.token
    })
  },
  created() {
    this.getSelectAuthority();
  },
  methods: {
    async getSelectAuthority() {
      const { data: res } = await this.$http.getSelectAuthority({
        token: this.token
      });
      if (res.code === 200) {
        this.selectAuthority = res.data;
        this.setSidebarItemShow();
      }
    },
    setSidebarItemShow() {
      for (let i = 0; i < this.sidebar.length; i++) {
        if (!this.sidebar[i].item) {
          continue;
        }
        for (let item of this.sidebar[i].item) {
          if (this.selectAuthority[item.show]) {
            this.sidebar[i].show = true;
            break;
          }
        }
      }
    },
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
