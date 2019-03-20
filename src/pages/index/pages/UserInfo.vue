<template>
  <div class="userInfo">
    <el-breadcrumb separator=">" class="bread">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>个人信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="userInfo-page">
      <div class="userInfo-detail">
        <el-form label-position="right" :model="userInfo">
          <el-form-item label="姓名">
            <el-input v-model="userInfo.realname" disabled></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="userInfo.number" disabled></el-input>
          </el-form-item>
          <el-form-item label="学院">
            <el-input v-model="userInfo.college" disabled></el-input>
          </el-form-item>
          <el-form-item label="班级">
            <el-input v-model="userInfo.class" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio v-model="userInfo.sex" :label=1>男</el-radio>
            <el-radio v-model="userInfo.sex" :label=0>女</el-radio>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="userInfo.address"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, Form, FormItem, Input, MessageBox, Radio } from "element-ui";

export default {
  name: "userInfo",
  components: {
    elBreadcrumb: Breadcrumb,
    elBreadcrumbItem: BreadcrumbItem,
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
      }
    }
  },
  created() {
    if (document.cookie.indexOf("avueUser=null") !== -1) {
      MessageBox.alert("请先登录！", "提示", {
        confirmButtonText: "确定",
        type: "warning",
        callback() {
          window.history.go(-1);
        }
      });
    }
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.getUserInfo,
        query: {
          number: this.$store.state.userInfo.number,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            that.userInfo = res.data;
          }
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.userInfo {
  padding-top: @header_height;
  &-page {
    background: white;
    height: 1000px;
    padding: 30px 0;
  }
  &-detail {
    margin: 0 auto;
    height: 1000px;
    width: 1200px;
    .el-input {
      width: 50%;
    }
  }
}
</style>
