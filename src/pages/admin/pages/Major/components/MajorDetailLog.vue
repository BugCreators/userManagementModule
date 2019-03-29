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
        <el-input v-model="info.name" name="name">
          <i class="errorMsg" slot="suffix">
            {{ errorMsg }}
          </i>
        </el-input>
      </el-form-item>
      <el-form-item :label="i18n['level']" prop="level">
        <el-input
          v-model="info.level"
          name="level"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['description']" prop="description">
        <el-input
          type="textarea"
          v-model="info.description"
          name="des"
          :autosize="{ minRows: 3, maxRows: 5 }"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['train_objective']" prop="train_objective">
        <el-input
          type="textarea"
          v-model="info.train_objective"
          name="des"
          :autosize="{ minRows: 3, maxRows: 5 }"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['main_course']" prop="main_course">
        <el-input
          type="textarea"
          v-model="info.main_course"
          name="des"
          :autosize="{ minRows: 3, maxRows: 5 }"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['employment_direction']" prop="employment_direction">
        <el-input
          type="textarea"
          v-model="info.employment_direction"
          name="des"
          :autosize="{ minRows: 3, maxRows: 5 }"
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
  Message
} from "element-ui";

export default {
  name: "majorDetailLog",
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
      errorMsg: "",
      i18n: {
        name: "专业名",
        level: "学历层次",
        college: "所属学院",
        description: "专业概况",
        train_objective: "培养目标",
        main_course: "主要课程",
        employment_direction: "就业方向"
      },
      loading: true,
      rules: {
        name: [
          { required: true, message: "请输入专业名称", trigger: "blur" }
        ]
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
        url: this.$store.state.getMajorDetail,
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
        url = this.$store.state.changeMajor;
      } else {
        url = this.$store.state.addMajor;
      }
      if (this.info.name === "") {
        this.errorMsg = "专业名不能为空！";
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
