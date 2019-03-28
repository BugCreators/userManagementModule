<template>
  <div class="searchLine">
    <el-input v-model="searchValue.name" :placeholder="placeholder"></el-input>
    <el-button type="primary" @click="serchValueChange"
      ><i class="el-icon-search"></i>搜索</el-button
    >
    <el-button @click="serchValueClear"
      ><i class="el-icon-refresh"></i>重置</el-button
    >
  </div>
</template>

<script>
import { Button, Input } from "element-ui";

export default {
  name: "searchBox",
  components: {
    elButton: Button,
    elInput: Input
  },
  props: {
    moduleName: String
  },
  data() {
    return {
      searchValue: {
        college: "",
        department: "",
        class: "",
        name: ""
      },
      i18n: {
        college: "学院",
        department: "部门",
        major: "专业",
        class: "班级",
        authority: "权限"
      }
    };
  },
  computed: {
    placeholder() {
      return "请输入" + this.i18n[this.moduleName] + "名称";
    }
  },
  methods: {
    serchValueChange() {
      this.$store.commit("setSearchValue", {
        name: this.searchValue.name
      });
    },
    serchValueClear() {
      if (this.searchValue.name) {
        this.searchValue.name = "";
        this.$store.commit("setSearchValue", {
          name: ""
        });
      }
    }
  }
};
</script>

<style lang="less">
.searchLine {
  margin-bottom: 10px;
  text-align: center;
  .el-input {
    margin-right: 10px;
    width: 20%;
  }
}
</style>
