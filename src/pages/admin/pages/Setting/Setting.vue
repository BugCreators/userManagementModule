<template>
  <div class="setting mg--20">
    <div class="setting-page">
      <el-form :model="setting">
        <el-form-item :label="i18n.schoolName">
          <el-input v-model="setting.schoolName" :disabled="disabledName"></el-input>
          <div class="editButton">
            <div v-if="disabledName">
              <span class="editInfo" @click="changeDisabledName">修改</span>
            </div>
            <div v-else>
              <span class="editInfo" @click="changeInfo('schoolName')">确定</span>
              <span class="editInfo" @click="changeDisabledName">取消</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="i18n.schoolAddress">
          <el-input v-model="setting.schoolAddress" :disabled="disabledAddress"></el-input>
          <div class="editButton">
            <div v-if="disabledAddress">
              <span class="editInfo" @click="changeDisabledAddress">修改</span>
            </div>
            <div v-else>
              <span class="editInfo" @click="changeInfo('schoolAddress')">确定</span>
              <span class="editInfo" @click="changeDisabledAddress">取消</span>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item :label="i18n.carousel + '（最多6张）'">
          <el-card v-for="(item, index) in setting.carousel" :key="index">
            <div slot="header">
              <span>{{ item.name }}</span>
              <el-button class="card-button" type="text" @click="deleteCarouselItem(index)">删除</el-button>
            </div>
            <div>
              链接：
              <el-input v-model="item.href" :disabled="true"></el-input>
            </div>
            <el-upload
              accept="image/jpg,image/png"
              action="Upload"
              list-type="picture"
              :auto-upload="false"
              :file-list="[item]"
              :limit="2"
              :on-change="handleChange"
            >
              图片：
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-card>
          <el-card type="addCard" v-if="setting.carousel.length < 6" class="addCarouseItem">
            <span class="el-icon-circle-plus-outline addButton" @click="addCarouseItem"></span>
          </el-card>
        </el-form-item> -->
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  Button,
  Card,
  Form,
  FormItem,
  Input,
  Loading,
  MessageBox,
  Upload,
  Message
} from "element-ui";

export default {
  name: "sysSetting",
  components: {
    elButton: Button,
    elCard: Card,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input,
    elUpload: Upload
  },
  data() {
    return {
      setting: {
        schoolName: "",
        schoolAddress: "",
        carousel: [],
        systemWebsite: []
      },
      i18n: {
        schoolName: "学校名称",
        schoolAddress: "学校地址",
        carousel: "轮播图",
        href: "链接",
        systemWebsite: "系统链接"
      },
      disabledName: true,
      disabledAddress: true
    };
  },
  created() {
    let that = this;
    let loading = Loading.service();
    this.$store.dispatch("getItems", {
      url: this.$store.state.getSysSetting,
      cb(res) {
        loading.close();
        if (res.code === 200) {
          that.setting = res.data;
          that.setting.carousel = that.setting.carousel.map(item => {
            item.name = item.url.split('/').pop();
            item.url = that.$store.state.baseUrl + item.url;
            return item;
          });
          that.$store.commit("setSetting", res.data);
        } else {
          MessageBox.alert(`读取系统配置出错，请稍候重试`, `系统出错`, {
            type: `error`,
            confirmButtonText: `确定`
          });
        }
      }
    });
  },
  methods: {
    changeDisabledName() {
      this.disabledName = !this.disabledName;
    },
    changeDisabledAddress() {
      this.disabledAddress = !this.disabledAddress;
    },
    changeInfo(type) {
      let url, data;
      if (type === "schoolName") {
        url = this.$store.state.changeSchoolName,
        data = this.setting.schoolName
      } else if (type === "schoolAddress") {
        url = this.$store.state.changeSchoolAddress,
        data = this.setting.schoolAddress
      }
      let that = this;
      this.$store.dispatch("getItems", {
        url,
        query: {
          data,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            Message.success(res.msg);
            if (type === "schoolName") {
              that.changeDisabledName();
            } else if (type === "schoolAddress") {
              that.changeDisabledAddress();
            }
          } else {
            Message.error(res.msg);
          }
        }
      })
    },
    deleteCarouselItem(index) {
      this.setting.carousel.splice(index, 1);
    },
    addCarouseItem() {
      if (this.setting.carousel.length > 6) {
        Message.error('轮播图不能超过6个！')
      }
      this.setting.carousel.push({
        url: "",
        href: ""
      })
    },
    handleChange(file, fileList) {
      let fileType = file.raw.type;
      const isJPG = fileType === "image/jpg" || fileType === "image/png";
      const isLt1M = file.size / 1024 < 500;
      if (!isJPG) {
        Message.error("只能上传jpg/png文件!");
      }
      if (!isLt1M) {
        Message.error(`文件大小不能超过500kb!`);
      }
      fileList.splice(0, 1, file);
      fileList.pop();
    }
  }
};
</script>

<style lang="less" scope>
.setting {
  background: white;
  padding: 30px 0;
  .setting-page {
    padding-left: 40px;
    .el-form {
      .el-card {
        display: inline-block;
        margin-right: 20px;
        width: 25%;
        .el-input {
          width: 85%;
        }
        .el-upload__tip {
          display: inline-block;
          margin-left: 10px;
        }
        &:not([type="addCard"]) {
          &:nth-child(4) {
            margin-left: 5em;
          }
        }
        &.addCarouseItem {
          height: 300px;
          font-size: 40px;
          position: relative;
          text-align: center;
          width: 250px;
          .addButton {
            cursor: pointer;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            &:hover {
              color: @default_color;
            }
          }
        }
      }
    }
  }
  .el-input {
    width: 50%;
  }
}
.editButton {
  display: inline-block;
  .editInfo {
    cursor: pointer;
    color: @default_color;
    margin-left: 20px;
  }
}
.card-button {
  float: right;
}
</style>
