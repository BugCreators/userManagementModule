<template>
  <div class="listWarp">
    <el-button v-if="showDeleted" type="danger" @click="listDeletion"
      >批量删除</el-button
    >
    <el-button v-if="showAdd" type="primary" @click="add"
      >添加{{ i18n[moduleName] }}</el-button
    >
    <el-button v-if="showImport" type="primary" @click="listImport"
      >批量添加</el-button
    >
    <el-button v-if="showExport" type="primary" @click="listExport"
      >导出数据</el-button
    >
    <span class="dataSum">共有数据：{{ count }} 条</span>
  </div>
</template>

<script>
import { Button } from "element-ui";

export default {
  name: "listWarp",
  components: {
    elButton: Button
  },
  props: {
    count: Number,
    addFuncName: String,
    delFuncName: String,
    exportFuncName: String,
    moduleName: String,
    showDeleted: {
      type: Boolean,
      default: true
    },
    showAdd: {
      type: Boolean,
      default: true
    },
    showImport: {
      type: Boolean,
      default: true
    },
    showExport: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      i18n: {
        branch: "部门",
        role: "角色",
        college: "学院",
        department: "院系",
        major: "专业",
        class: "班级",
        student: "学生"
      }
    };
  },
  methods: {
    listDeletion() {
      this.$emit(this.delFuncName);
    },
    add() {
      this.$emit(this.addFuncName);
    },
    listImport() {
      this.$store.commit("switchImportLog");
    },
    listExport() {
      this.$emit(this.exportFuncName);
    }
  }
};
</script>

<style lang="less" scoped>
.listWarp {
  margin-bottom: 10px;
  overflow: hidden;
  .dataSum {
    float: right;
    line-height: 2.5;
  }
}
</style>
