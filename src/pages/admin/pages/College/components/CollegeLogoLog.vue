<template>
  <el-dialog
    class="logoChange"
    :before-close="switchLogoLog"
    :visible.sync="showLogoLog"
  >
    <div v-if="!fileList.length" class="logoMsg">暂无院徽~</div>
    <el-upload
      accept="image/jpg,image/png"
      action="Upload"
      list-type="picture-card"
      ref="upload"
      :auto-upload="false"
      :file-list="fileList"
      :http-request="uploadIogo"
      :limit="1"
      :on-change="validateForm"
      drag
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将图片拖到此处<br />或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        这里只能上传一张,如需更换请先手动删除列表中的！
      </div>
      <div class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过1MB
      </div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button class="deleteBtn" type="danger" @click="deleteLogoConfirm"
        >删除Logo</el-button
      >
      <el-button @click="switchLogoLog">取 消</el-button>
      <el-button type="primary" @click="uploadSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Button, Dialog, Message, Upload } from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import { mapState, mapMutations } from "vuex";

export default {
  name: "collegeLogoChange",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elUpload: Upload
  },
  props: {
    collegeId: Number
  },
  data() {
    return {
      logo: {
        name: "",
        url: "",
        size: "",
        type: ""
      },
      isChange: false,
      fileList: []
    };
  },
  computed: {
    ...mapState({
      showLogoLog: state => state.showLogoLog,
      token: state => state.userInfo.token
    })
  },
  created() {
    this.getCollegeLogo();
  },
  methods: {
    ...mapMutations(["switchLogoLog"]),
    async getCollegeLogo() {
      const { data: res } = await this.$http.getCollegeLogo({
        token: this.token,
        id: this.collegeId
      });
      if (res.code === 200) {
        if (res.data.url != "" && res.data.url != null) {
          res.data.url = this.$store.state.baseUrl + res.data.url;
          this.fileList.push(res.data);
        }
      }
    },
    uploadSubmit() {
      this.$refs.upload.submit();
    },
    async uploadIogo(param) {
      let data = new FormData();
      data.append("image", param.file);
      data.append("id", this.collegeId);
      data.append("token", this.token);
      const { data: res } = await this.$http.changeCollegeLogo(data);
      if (res.code === 200) {
        Message.success(res.msg);
        this.$emit("logoChange", res.data);
        this.switchLogoLog();
      } else {
        Message.error(res.msg);
      }
    },
    handleChange() {
      this.isChange = true;
    },
    validateForm(file) {
      let fileType = file.raw.type;
      const isJPG = fileType === "image/jpg" || fileType === "image/png";
      const isLt1M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        Message.error("只能上传jpg/png文件!");
      }
      if (!isLt1M) {
        Message.error(`文件大小不能超过2MB!`);
      }
      return isJPG && isLt1M;
    },
    deleteLogoConfirm() {
      avueMsgBox({
        message: "确定删除该学院现在的院徽？"
      })
        .then(() => this.deleteLogo())
        .catch(() => Message.info("取消删除"));
    },
    async deleteLogo() {
      const { data: res } = await this.$http.deleteCollegeLogo({
        id: this.collegeId,
        token: this.token
      });
      if (res.code === 200) {
        Message.success(res.msg);
        this.$emit("logoDelete", res.data);
        this.switchLogoLog();
      } else {
        Message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less">
.logoMsg {
  margin-bottom: 20px;
}
.logoChange {
  .el-dialog__body {
    text-align: center;
  }
}
.deleteBtn {
  float: left;
}
</style>
