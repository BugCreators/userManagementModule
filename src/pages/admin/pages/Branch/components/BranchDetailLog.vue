<template>
  <el-dialog
    :before-close="closeDetailLog"
    :title="logTitle"
    :visible.sync="showDetailLog"
  >
    <el-form
      id="form"
      label-position="right"
      label-width="80px"
      ref="info"
      :model="info"
      :rules="rules"
    >
      <el-form-item :label="i18n['name']" prop="name">
        <el-input
          v-model="info.name"
          name="name"
          :placeholder="'请输入' + i18n['name']"
        >
          <i class="errorMsg" slot="suffix">
            {{ errorMsg }}
          </i>
        </el-input>
      </el-form-item>
      <el-form-item prop="website" :label="i18n['website']">
        <el-input
          v-model="info.website"
          name="website"
          :placeholder="'请输入' + i18n['website']"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['level']">
        <el-radio-group v-model="info.level">
          <el-radio :label="0">校级</el-radio>
          <el-radio :label="1">院级</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="i18n['operating_duty']" prop="operating_duty">
        <el-input
          type="textarea"
          v-model="info.operating_duty"
          name="operating_duty"
          :autosize="{ minRows: 10, maxRows: 15 }"
          :placeholder="'请输入' + i18n['operating_duty']"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['description']" prop="description">
        <el-input
          type="textarea"
          v-model="info.description"
          name="des"
          :autosize="{ minRows: 10, maxRows: 15 }"
          :placeholder="'请输入' + i18n['description']"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDetailLog">取 消</el-button>
      <el-button type="primary" @click="formSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  Button,
  Dialog,
  Form,
  FormItem,
  Input,
  Loading,
  Message,
  Radio,
  RadioGroup
} from "element-ui";

export default {
  name: "branchDetailLog",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input,
    elRadio: Radio,
    elRadioGroup: RadioGroup
  },
  props: {
    dataId: Number
  },
  data() {
    return {
      info: {
        name: "",
        operating_duty: "",
        level: 1,
        description: "",
        website: ""
      },
      i18n: {
        name: "部门名",
        website: "官网链接",
        level: "等级",
        operating_duty: "主要职能",
        description: "概述"
      },
      errorMsg: "",
      loading: true,
      rules: {
        name: [{ required: true, message: "请输入部门名称" }]
      }
    };
  },
  mounted() {
    if (this.dataId) {
      this.getInfo();
    }
  },
  computed: {
    logTitle() {
      let title = this.dataId ? "编辑" : "添加";
      return title + "部门";
    },
    showDetailLog() {
      return this.$store.state.showDetailLog;
    }
  },
  methods: {
    getInfo() {
      let that = this;
      let loading = Loading.service();
      this.$store.dispatch("getItems", {
        url: this.$store.state.getBranchDetail,
        query: {
          id: this.dataId,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.info = res.data;
          } else {
            Message.error(res.msg);
            that.closeDetailLog();
          }
        }
      });
    },
    formSubmit() {
      let url,
        that = this;
      if (this.dataId) {
        url = this.$store.state.changeBranch;
      } else {
        url = this.$store.state.addBranch;
      }
      if (this.info.name === "") {
        this.errorMsg = "学院名不能为空！";
        return;
      }
      this.errorMsg = "";
      let loading = Loading.service({
        target: document.getElementById("form")
      });
      this.$store.dispatch("postItems", {
        url,
        query: {
          data: this.info,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            Message.success(res.msg);
            this.dataId
              ? that.$emit("dataChange", res.data)
              : that.$emit("listChange");
            that.closeDetailLog();
          } else {
            Message.error(res.msg || "添加失败，请稍后重试");
          }
        }
      });
    },
    closeDetailLog() {
      this.$store.commit("switchDetailLog");
    }
  }
};
</script>
