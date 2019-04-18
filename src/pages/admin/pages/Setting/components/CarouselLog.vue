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
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeLog">取 消</el-button>
      <el-button type="primary" @click="uploadSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Button, Dialog, Input, Message, Upload } from "element-ui";

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
  created() {
    if (this.dataIndex) {
      this.getCarouselItem();
    }
  },
  methods: {
    getCarouselItem() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.getCarouselItem,
        query: {
          index: this.dataIndex,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            that.item = res.data;
            that.item.url = that.$store.state.baseUrl + that.item.url;
          }
        }
      });
    },
    closeLog() {
      this.$emit("closeLog");
    },
    handleChange(file, fileList) {
      let fileType = file.raw.type;
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
    uploadCarousel(param) {
      let url,
        that = this;
      let data = new FormData();
      data.append("image", param.file);
      data.append("token", this.$store.state.userInfo.token);
      if (this.dataIndex) {
        data.append("index", this.dataIndex);
        url = this.$store.state.changeCarouselItemPicture;
      } else {
        data.append("website", this.item.href);
        url = this.$store.state.addCarouselItem;
      }
      this.$store.dispatch("postItems", {
        url,
        query: data,
        config: {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        },
        cb(res) {
          if (res.code === 200) {
            Message.success(res.msg);
            that.$emit("carouselChange");
            that.closeLog();
          } else {
            Message.error(res.msg);
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scope>
.website {
  margin-bottom: 20px;
}
.el-upload {
  &-list--picture &-list__item {
    height: auto;
  }
  &-list--picture &-list__item-thumbnail {
    height: auto;
    min-height: 70px;
    width: auto;
  }
  &__tip {
    display: inline-block;
    margin-left: 10px;
  }
}
</style>
