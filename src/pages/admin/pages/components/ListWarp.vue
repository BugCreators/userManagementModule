<template>
  <div class="listWarp">
    <el-button v-if="showDeleted" type="danger" @click="batchDeletion"
      >批量删除</el-button
    >
    <el-button v-if="showAdd" type="primary" @click="add"
      >添加{{ i18n[moduleName] }}</el-button
    >
    <el-button v-if="showImport" type="primary" @click="batchImport"
      >批量添加</el-button
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
    addFuncName: String,
    count: Number,
    delFuncName: String,
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
    }
  },
  data() {
    return {
      i18n: {
        college: "学院",
        department: "部门",
        major: "专业",
        class: "班级"
      }
    };
  },
  methods: {
    batchDeletion() {
      this.$emit(this.delFuncName);
    },
    add() {
      this.$emit(this.addFuncName);
    },
    batchImport() {
      this.$store.commit("switchImportLog");
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
