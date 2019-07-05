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
      <el-form-item :label="i18n['collegeName']" prop="college_id">
        <el-select
          v-model="info.college_id"
          :placeholder="'请选择' + i18n['collegeName']"
        >
          <el-option
            v-for="item in collegeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <i class="errorMsg">
          {{ errorMsg2 }}
        </i>
      </el-form-item>
      <el-form-item :label="i18n['description']" prop="description">
        <el-input
          type="textarea"
          v-model="info.description"
          name="description"
          :autosize="{ minRows: 3, maxRows: 5 }"
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
  Message,
  Option,
  Select
} from "element-ui";
import { mapState, mapMutations } from "vuex";

export default {
  name: "departmentDetailLog",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input,
    elOption: Option,
    elSelect: Select
  },
  props: {
    dataId: Number
  },
  data() {
    return {
      info: {
        name: "",
        college_id: "",
        description: ""
      },
      errorMsg: "",
      errorMsg2: "",
      i18n: {
        name: "院系名",
        collegeName: "学院",
        description: "简介"
      },
      loading: true,
      rules: {
        name: [{ required: true, message: "请输入专业名称", trigger: "blur" }],
        college_id: [
          { required: true, message: "请选择学院", trigger: "change" }
        ]
      },
      collegeList: {}
    };
  },
  computed: {
    ...mapState({
      showDetailLog: state => state.showDetailLog,
      token: state => state.userInfo.token
    }),
    logTitle() {
      return `${this.dataId ? "编辑" : "添加"}专业`;
    }
  },
  mounted() {
    this.getCollegeList();
    if (this.dataId) {
      this.getInfo();
    }
  },
  methods: {
    ...mapState(["getItems", "postItems"]),
    ...mapMutations(["switchDetailLog"]),
    async getInfo() {
      const loading = Loading.service();
      const { data: res } = await this.$http.getDepartmentDetail({
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
    async getCollegeList() {
      const { data: res } = await this.$http.getCollegeList();
      if (res.code === 200) {
        this.collegeList = res.data;
      } else {
        Message.error(res.msg);
      }
    },
    async formSubmit() {
      let data = {};

      if (this.info.name === "") {
        this.errorMsg = "院系名不能为空！";
        return;
      }
      this.errorMsg = "";
      if (this.info.college_id === "") {
        this.errorMsg2 = "学院不能为空！";
        return;
      }
      this.errorMsg2 = "";
      const loading = Loading.service({
        target: document.getElementById("form")
      });
      if (this.dataId) {
        data = await this.$http.changeDepartment({
          data: this.info,
          token: this.token
        });
      } else {
        data = await this.$http.addDepartment({
          data: this.info,
          token: this.token
        });
      }
      const { data: res } = data;
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
