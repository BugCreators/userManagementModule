<template>
  <div class="searchLine">
    <el-select v-if="showSelect" v-model="searchValue.basis">
      <el-option :label="options[0].label" :value="options[0].value">
      </el-option>
      <el-option
        v-if="basisOfCollege"
        :label="options[1].label"
        :value="options[1].value"
      >
      </el-option>
      <el-option
        v-if="basisOfGrade"
        :label="options[2].label"
        :value="options[2].value"
      >
      </el-option>
      <el-option
        v-if="basisOfModule"
        :label="options[3].label"
        :value="options[3].value"
      >
      </el-option>
      <el-option
        v-if="basisOfLevel"
        :label="options[4].label"
        :value="options[4].value"
      >
      </el-option>
      <el-option
        v-if="basisOfClass"
        :label="options[5].label"
        :value="options[5].value"
      >
      </el-option>
      <el-option
        v-if="basisOfBranch"
        :label="options[6].label"
        :value="options[6].value"
      >
      </el-option>
      <el-option
        v-if="basisOfRole"
        :label="options[7].label"
        :value="options[7].value"
      >
      </el-option>
    </el-select>
    <el-input
      class="input"
      v-model="searchValue.name"
      placeholder="请输入名称"
      @keyup.enter.native="serchValueChange"
      clearable
    ></el-input>
    <el-button type="primary" @click="serchValueChange"
      ><i class="el-icon-search"></i>搜索</el-button
    >
    <el-button @click="serchValueClear"
      ><i class="el-icon-refresh"></i>重置</el-button
    >
  </div>
</template>

<script>
import { Button, Input, Option, Select } from "element-ui";

export default {
  name: "searchBox",
  components: {
    elButton: Button,
    elInput: Input,
    elOption: Option,
    elSelect: Select
  },
  props: {
    moduleName: String,
    showSelect: {
      type: Boolean,
      default: true
    },
    basisOfCollege: {
      type: Boolean,
      default: true
    },
    basisOfGrade: {
      type: Boolean,
      default: false
    },
    basisOfModule: {
      type: Boolean,
      default: false
    },
    basisOfLevel: {
      type: Boolean,
      default: false
    },
    basisOfClass: {
      type: Boolean,
      default: false
    },
    basisOfBranch: {
      type: Boolean,
      default: false
    },
    basisOfRole: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [
        {
          value: 0,
          label: "按名字搜索"
        },
        {
          value: 1,
          label: "按学院搜索"
        },
        {
          value: 2,
          label: "按年级搜索"
        },
        {
          value: 3,
          label: "按模块搜索"
        },
        {
          value: 4,
          label: "按等级搜索"
        },
        {
          value: 5,
          label: "按班级搜素"
        },
        {
          value: 6,
          label: "按部门搜素"
        },
        {
          value: 7,
          label: "按身份搜素"
        }
      ],
      searchValue: {
        basis: 0,
        name: ""
      },
      i18n: {
        college: "学院",
        department: "院系",
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
        basis: this.searchValue.basis,
        name: this.searchValue.name
      });
    },
    serchValueClear() {
      if (this.searchValue.name || this.searchValue.basis != 0) {
        this.searchValue = {
          basis: 0,
          name: ""
        };
        this.$store.commit("setSearchValue", this.searchValue);
      }
    }
  }
};
</script>

<style lang="less">
.searchLine {
  margin-bottom: 10px;
  text-align: center;
  .el-input.input {
    margin-right: 10px;
    width: 20%;
  }
}
</style>
