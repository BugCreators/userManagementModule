<template>
  <el-dialog
    :before-close="switchDetailLog"
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
      <el-form-item :label="i18n['en_name']" prop="en_name">
        <el-input
          v-model="info.en_name"
          name="en_name"
          :placeholder="'请输入' + i18n['en_name']"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['website']" prop="website">
        <el-input
          v-model="info.website"
          name="website"
          :placeholder="'请输入' + i18n['website']"
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
      <el-button @click="switchDetailLog">取 消</el-button>
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
  Message
} from "element-ui";
import { mapState, mapMutations } from "vuex";

export default {
  name: "collegeDetailLog",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input
  },
  props: {
    dataId: Number
  },
  data() {
    return {
      info: {
        name: "",
        en_name: "",
        description: "",
        website: ""
      },
      i18n: {
        name: "学院名",
        en_name: "英文名",
        website: "官网链接",
        description: "概述"
      },
      errorMsg: "",
      loading: true,
      rules: {
        name: [{ required: true, message: "请输入学院名称" }]
      }
    };
  },
  computed: {
    ...mapState({
      showDetailLog: state => state.showDetailLog,
      token: state => state.userInfo.token
    }),
    logTitle() {
      return `${this.dataId ? "编辑" : "添加"}学院`;
    }
  },
  mounted() {
    if (this.dataId) {
      this.getInfo();
    }
  },
  methods: {
    ...mapMutations(["switchDetailLog"]),
    async getInfo() {
      let loading = Loading.service();
      const { data: res } = await this.$http.getCollegeDetailByAdmin({
        id: this.dataId,
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        this.info = res.data;
      } else {
        Message.error(res.msg);
        this.switchDetailLog();
      }
    },
    async formSubmit() {
      let data = {},
        res = {};
      if (this.info.name === "") {
        this.errorMsg = "学院名不能为空！";
        return;
      }
      this.errorMsg = "";
      let loading = Loading.service({
        target: document.getElementById("form")
      });
      if (this.dataId) {
        data = await this.$http.changeCollege({
          data: this.info,
          token: this.token
        });
      } else {
        data = await this.$http.addCollege({
          data: this.info,
          token: this.token
        });
      }
      res = data.data;
      loading.close();
      if (res.code === 200) {
        Message.success(res.msg);
        this.$emit("listChange");
        this.switchDetailLog();
      } else {
        Message.error(res.msg || "添加失败，请稍后重试");
      }
    }
  }
};
</script>
