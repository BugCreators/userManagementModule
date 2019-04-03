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
      <el-form-item :label="i18n['collegeName']" prop="college_id">
        <el-select
          v-model="info.college_id"
          :placeholder="'请选择' + i18n['name']"
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
  Option,
  Select
} from "element-ui";

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
  mounted() {
    this.getCollegeList();
    if (this.dataId) {
      this.getInfo();
    }
  },
  computed: {
    logTitle() {
      let title = this.dataId ? "编辑" : "添加";
      return title + "专业";
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
        url: this.$store.state.getDepartmentDetail,
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
    getCollegeList() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.getCollegeList,
        cb(res) {
          if (res.code === 200) {
            that.collegeList = res.data;
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    formSubmit() {
      let url,
        that = this;
      if (this.dataId) {
        url = this.$store.state.changeDepartment;
      } else {
        url = this.$store.state.addDepartment;
      }
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
