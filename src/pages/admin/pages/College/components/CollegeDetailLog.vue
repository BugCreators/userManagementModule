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
      <el-form-item label="学院名称" prop="collegeName">
        <el-input
          v-model="collegeDetail.collegeName"
          name="collegeName"
        ></el-input>
      </el-form-item>
      <el-form-item label="官网链接" prop="website">
        <el-input v-model="collegeDetail.website" name="website"></el-input>
      </el-form-item>
      <el-form-item label="学院描述" prop="des">
        <el-input
          type="textarea"
          v-model="collegeDetail.des"
          name="des"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传院徽">
        <el-upload
          action=""
          accept="image/jpg,image/png"
          list-type="picture-card"
          :on-change="handleChange"
          :auto-upload="false"
          :file-list="fileList"
          :limit="1"
          drag
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将图片拖到此处<br />或<em>点击上传</em>
          </div>
          <div class="el-upload__tip" slot="tip">
            这里只能上传一张,如需更换请先手动删除列表中的！
          </div>
          <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过1MB
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDetailLog">取 消</el-button>
      <el-button type="primary" @click="validateForm('collegeDetail')"
        >确 定</el-button
      >
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
  Message,
  Upload
} from "element-ui";

export default {
  name: "collegeDetailLog",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input,
    elUpload: Upload
  },
  props: {
    collegeId: Number
  },
  data() {
    return {
      collegeDetail: {
        collegeName: "",
        des: "",
        website: "",
        logo: {
          name: "",
          url: "",
          size: "",
          type: ""
        }
      },
      isChange: false,
      fileList: [],
      rules: {
        collegeName: [
          { required: true, message: "请输入学院名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    if (this.collegeId) {
      this.getCollegeDetail();
      this.fileList.push(this.collegeDetail.logo);
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
      /**********TEST***********/
      this.collegeDetail = {
        collegeName: "教育学院",
        des: "哈哈哈",
        website: "https://cn.vuejs.org",
        logo: {
          name: "logo.png",
          url: "https://cn.vuejs.org/images/logo.png",
          size: 6849,
          type: "image/png"
        }
      };
      /***********END***********/
      let that = this;
      this.$store.dispatch("getItems", {
        url: that.$store.state.getCollegeDetail,
        query: {
          id: that.collegeId
        },
        cb(res) {
          if (res.success) {
            that.collegeDetail = res.data;
            // that.fileList.push(res.data.logo);
          } else {
            Message.error({
              message: res.message || "获取信息失败，请稍后再试"
            });
            // that.closeDetailLog();
          }
        }
      });
    },
    handleChange() {
      this.isChange = true;
    },
    validateForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData(document.getElementById("form"));
          if (this.isChange) {
            let file = formData.get("file");
            const isJPG =
              file.type === "image/jpg" || file.type === "image/png";
            const isLt1M = file.size / 1024 / 1024 < 1;
            if (!isJPG) {
              Message.error("只能上传jpg/png文件!");
              return;
            }
            if (!isLt1M) {
              Message.error(`文件大小不能超过1MB!`);
              return;
            }
          }
          that.formSubmit(formData);
        } else {
          return false;
        }
      });
    },
    formSubmit(formData) {
      let that = this,
        url,
        msg;
      if (this.collegeId) {
        (url = this.$store.state.changeCollege), (msg = "修改");
      } else {
        (url = this.$store.state.addCollege), (msg = "添加");
      }
      formData.append("id", that.collegeId);
      formData.append("token", that.$store.state.userInfo.token);
      this.$store.dispatch("postItems", {
        url,
        query: formData,
        config: {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        },
        cb(res) {
          if (res.success) {
            Message.success({
              message: msg + "成功!"
            });
            this.closelog();
          } else {
            Message.success({
              message: res.message || msg + "失败，请稍后再试"
            });
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
