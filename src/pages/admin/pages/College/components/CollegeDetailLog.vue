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
      ref="collegeDetail"
      :model="collegeDetail"
      :rules="rules"
    >
      <el-form-item label="学院名称" prop="name">
        <el-input v-model="collegeDetail.name" name="collegeName">
          <i class="errorMsg" slot="suffix">
            {{ errorMsg }}
          </i>
        </el-input>
      </el-form-item>
      <el-form-item label="英文名" prop="name">
        <el-input
          v-model="collegeDetail.english_name"
          name="collegeName"
        ></el-input>
      </el-form-item>
      <el-form-item label="官网链接" prop="website">
        <el-input v-model="collegeDetail.website" name="website"></el-input>
      </el-form-item>
      <el-form-item label="学院描述" prop="description">
        <el-input
          type="textarea"
          v-model="collegeDetail.description"
          name="des"
          :autosize="{ minRows: 10, maxRows: 15 }"
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
  name: "collegeDetailLog",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input
  },
  props: {
    collegeId: Number
  },
  data() {
    return {
      collegeDetail: {
        name: "",
        english_name: "",
        description: "",
        website: ""
      },
      errorMsg: "",
      loading: true,
      rules: {
        collegeName: [
          { required: true, message: "请输入学院名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    if (this.collegeId) {
      this.getCollegeDetail();
    }
  },
  computed: {
    logTitle() {
      let title = this.collegeId ? "编辑" : "添加";
      return title + "学院";
    },
    showDetailLog() {
      return this.$store.state.showDetailLog;
    }
  },
  methods: {
    getCollegeDetail() {
      let that = this;
      let loading = Loading.service();
      this.$store.dispatch("getItems", {
        url: this.$store.state.getCollegeDetailByAdmin,
        query: {
          id: this.collegeId,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.collegeDetail = res.data;
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
      if (this.collegeId) {
        url = this.$store.state.changeCollege;
      } else {
        url = this.$store.state.addCollege;
      }
      if (this.collegeDetail.name === "") {
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
          data: this.collegeDetail,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            Message.success(res.msg);
            this.collegeId
              ? that.$emit("collegeChange", res.data)
              : that.$emit("collegeListChange");
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
