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
import { mapMutations } from "vuex";

export default {
  name: "listWarp",
  components: {
    elButton: Button
  },
  props: {
    count: {
      type: Number,
      default: 0
    },
    addFuncName: {
      type: String,
      default: "openDetailLog"
    },
    delFuncName: {
      type: String,
      default: "datasDeleteConfirm"
    },
    exportFuncName: {
      type: String,
      default: "listExportConfirm"  
    },
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
        administrator: "管理员",
        college: "学院",
        department: "院系",
        major: "专业",
        class: "班级",
        student: "学生",
        teacher: "教师"
      }
    };
  },
  methods: {
    ...mapMutations(["switchImportLog"]),
    listDeletion() {
      this.$emit(this.delFuncName);
    },
    add() {
      this.$emit(this.addFuncName);
    },
    listImport() {
      this.switchImportLog();
    },
    listExport() {
      this.$emit(this.exportFuncName);
    }
  }
};
</script>

<style lang="less" src="./ListWarp.less" scoped></style>
