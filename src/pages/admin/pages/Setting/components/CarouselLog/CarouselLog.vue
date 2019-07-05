<template>
  <el-dialog
    :before-close="closeLog"
    :title="item.name"
    :visible.sync="showLog"
  >
    <div v-if="!dataIndex" class="website">
      链接：
      <el-input v-model="item.href"></el-input>
    </div>
    <el-upload
      accept="image/jpg,image/png"
      action="Upload"
      list-type="picture"
      ref="upload"
      :auto-upload="false"
      :file-list="[item]"
      :http-request="uploadCarousel"
      :limit="2"
      :on-change="handleChange"
    >
      图片：
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
    <div class="dialog-footer" slot="footer">
      <el-button @click="closeLog">取 消</el-button>
      <el-button type="primary" @click="uploadSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Button, Dialog, Input, Message, Upload } from "element-ui";
import { mapState } from "vuex";

export default {
  name: "carouseLog",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elInput: Input,
    elUpload: Upload
  },
  props: {
    dataIndex: String,
    showLog: Boolean
  },
  data() {
    return {
      item: {
        name: "",
        href: "",
        url: ""
      }
    };
  },
  computed: {
    ...mapState({
      token: state => state.userInfo.token
    })
  },
  created() {
    if (this.dataIndex) {
      this.getCarouselItem();
    }
  },
  methods: {
    async getCarouselItem() {
      const { data: res } = await this.$http.getCarouselItem({
        index: this.dataIndex,
        token: this.token
      });
      if (res.code === 200) {
        this.item = res.data;
        this.item.url = this.$store.state.baseUrl + this.item.url;
      }
    },
    closeLog() {
      this.$emit("closeLog");
    },
    handleChange(file, fileList) {
      const fileType = file.raw.type;
      const isJPG = fileType === "image/jpg" || fileType === "image/png";
      const isLt1M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        Message.error(`只能上传jpg/png文件!`);
      }
      if (!isLt1M) {
        Message.error(`文件大小不能超过2MB!`);
      }
      fileList.splice(0, 1, file);
      fileList.pop();
    },
    uploadSubmit() {
      this.$refs.upload.submit();
    },
    async uploadCarousel({ file }) {
      let data = {};
      const formData = new FormData();
      formData.append("image", file);
      formData.append("token", this.token);
      if (this.dataIndex) {
        formData.append("index", this.dataIndex);
        data = await this.$http.changeCarouselItemPicture(formData);
      } else {
        formData.append("website", this.item.href);
        data = await this.$http.addCarouselItem(formData);
      }
      const { data: res } = data;
      if (res.code === 200) {
        Message.success(res.msg);
        this.$emit("settingChange");
        this.closeLog();
      } else {
        Message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less" src="./CarouselLog.less" scope></style>
