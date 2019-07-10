<template>
  <div class="userInfo" :class="!isAdmin ? 'pdt-hh' : 'mg--20'">
    <el-breadcrumb v-if="!isAdmin" separator=">" class="bread">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="userInfo-page">
      <div :class="!isAdmin ? 'userInfo-main' : 'userInfo-admin'">
        <el-form label-position="left" :model="userInfo">
          <el-form-item v-for="item in i18n" :key="item.index" :label="item.cn">
            <el-input
              v-if="!item.radio"
              v-model="userInfo[item.en]"
              :disabled="item.disabled"
              :type="item.type"
              :rows="item.rows"
            ></el-input>
            <div v-else>
              <el-radio
                v-for="(value, key) in item.label"
                v-model="userInfo[item.en]"
                :key="value"
                :label="value"
              >
                {{ key }}
              </el-radio>
            </div>
          </el-form-item>
          <div class="btns">
            <el-button type="primary" @click="confirmChange">修改</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Radio
} from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import { mapState, mapActions } from "vuex";

export default {
  name: "userInfo",
  components: {
    elBreadcrumb: Breadcrumb,
    elBreadcrumbItem: BreadcrumbItem,
    elButton: Button,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input,
    elRadio: Radio
  },
  data() {
    return {
      userInfo: {
        realname: "",
        number: "",
        college: "",
        class: "",
        email: "",
        sex: null,
        address: "",
        description: ""
      },
      i18n: [
        {
          en: "realname",
          cn: "姓名",
          disabled: true
        },
        {
          en: "number",
          cn: "学号",
          disabled: true
        },
        {
          en: "college",
          cn: "学院",
          disabled: true
        },
        {
          en: "class",
          cn: "班级",
          disabled: true
        },
        {
          en: "email",
          cn: "邮箱"
        },
        {
          en: "sex",
          cn: "性别",
          radio: true,
          label: {
            男: 1,
            女: 0
          }
        },
        {
          en: "address",
          cn: "地址"
        },
        {
          en: "description",
          cn: "个人描述",
          type: "textarea",
          rows: 10
        }
      ]
    };
  },
  computed: {
    ...mapState({
      token: state => state.userInfo.token
    }),
    isAdmin() {
      return location.href.indexOf("admin") != -1;
    }
  },
  created() {
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
    this.getUserInfo();
  },
  methods: {
    ...mapActions(["clearUserInfo"]),
    async getUserInfo() {
      const res = await this.$http.getUserInfo({
        number: this.$store.state.userInfo.number,
        token: this.token
      });
      if (res.code === 200) {
        this.userInfo = res.data;
      } else if (res.code === 402) {
        this.reload();
      }
    },
    confirmChange() {
      avueMsgBox({
        message: "确定进行修改？"
      })
        .then(() => this.changeInfoByUser())
        .catch(() => Message.info("取消修改"));
    },
    async changeInfoByUser() {
      const res = await this.$http.changeInfoByUser({
        number: this.userInfo.number,
        email: this.userInfo.email,
        sex: this.userInfo.sex,
        address: this.userInfo.address,
        description: this.userInfo.description,
        token: this.token
      });
      if (res.code === 200) {
        Message.success(res.msg);
      } else if (res.code === 402) {
        this.reload();
      } else {
        Message.error(res.msg);
      }
    },
    async reload() {
      this.clearUserInfo();
      avueMsgBox(
        {
          message: "会话已过期，要进行操作请重新登陆！"
        },
        1
      )
        .then(() => (location.href = "login.html"))
        .catch(() => (location.href = "index.html"));
    }
  }
};
</script>

<style lang="less" src="./UserInfo.less" scoped></style>
