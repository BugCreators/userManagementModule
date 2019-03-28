<template>
  <el-dialog>
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
      <div class="el-upload__text">将图片拖到此处<br />或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">
        这里只能上传一张,如需更换请先手动删除列表中的！
      </div>
      <div class="el-upload__tip" slot="tip">
        只能上传jpg/png文件，且不超过1MB
      </div>
    </el-upload>
  </el-dialog>
</template>

<script>
import { Dialog, Message, Upload } from "element-ui";

export default {
  name: "collegeLogoChange",
  components: {
    elDialog: Dialog,
    elUpload: Upload
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
  methods: {
    handleChange() {
      this.isChange = true;
    },
    validateForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let formData = new FormData(document.getElementById("form"));
          console.log(document.getElementById("form"));
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
    }
  }
};
</script>
