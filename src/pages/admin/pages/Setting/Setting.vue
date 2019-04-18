<template>
  <div class="setting mg--20">
    <div class="setting-page">
      <el-form :model="setting">
        <el-form-item :label="i18n.schoolName">
          <el-input
            v-model="setting.schoolName"
            :disabled="disabledName"
          ></el-input>
          <div class="editButton">
            <div v-if="disabledName">
              <span @click="changeDisabledName">修改</span>
            </div>
            <div v-else>
              <span @click="changeInfo('schoolName')">确定</span>
              <span @click="changeDisabledName">取消</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="i18n.schoolAddress">
          <el-input
            v-model="setting.schoolAddress"
            :disabled="disabledAddress"
          ></el-input>
          <div class="editButton">
            <div v-if="disabledAddress">
              <span @click="changeDisabledAddress">修改</span>
            </div>
            <div v-else>
              <span @click="changeInfo('schoolAddress')">确定</span>
              <span @click="changeDisabledAddress">取消</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="i18n.carousel + '（最多6张）'">
          <CarouselCard
            v-for="item in setting.carousel"
            :key="item.index"
            :item="item"
            @carouselChange="carouselChange"
            @deleteItem="deleteItem"
            @openLog="openLog"
          />
          <el-card
            v-if="setting.carousel.length < 6"
            class="addCarouseItem"
            type="addCard"
          >
            <span
              class="el-icon-circle-plus-outline addButton"
              @click="openLog()"
            ></span>
          </el-card>
        </el-form-item>
      </el-form>
      <CarouselLog
        v-if="showLog"
        :dataIndex="currentIndex"
        :showLog="showLog"
        @carouselChange="carouselChange"
        @closeLog="closeLog"
      />
    </div>
  </div>
</template>

<script>
import {
  Card,
  Form,
  FormItem,
  Input,
  Loading,
  MessageBox,
  Message
} from "element-ui";
import CarouselCard from "./components/CarouselCard";
import CarouselLog from "./components/CarouselLog";

export default {
  name: "sysSetting",
  components: {
    CarouselCard,
    CarouselLog,
    elCard: Card,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input
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
      disabledAddress: true,
      showLog: false,
      currentIndex: ""
    };
  },
  created() {
    this.getSysSetting();
  },
  methods: {
    getSysSetting() {
      let that = this;
      let loading = Loading.service();
      this.$store.dispatch("getItems", {
        url: this.$store.state.getSysSetting,
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.setting = res.data;
            that.setting.carousel = that.setting.carousel.map(item => {
              item.name = item.url.split("/").pop();
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
    changeDisabledName() {
      this.disabledName = !this.disabledName;
    },
    changeDisabledAddress() {
      this.disabledAddress = !this.disabledAddress;
    },
    changeInfo(type) {
      let url, data;
      if (type === "schoolName") {
        (url = this.$store.state.changeSchoolName),
          (data = this.setting.schoolName);
      } else if (type === "schoolAddress") {
        (url = this.$store.state.changeSchoolAddress),
          (data = this.setting.schoolAddress);
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
      });
    },
    openLog(index) {
      this.currentIndex = index;
      this.showLog = true;
    },
    closeLog() {
      this.currentIndex = "";
      this.showLog = false;
    },
    deleteItem(index) {
      this.setting.carousel.splice(index, 1);
    },
    carouselChange() {
      this.getSysSetting();
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
        max-height: 400px;
        max-width: 450px;
        width: 25%;
        .el-input {
          width: 85%;
        }
        &:not([type="addCard"]) {
          &:nth-child(4) {
            margin-left: 5em;
          }
        }
        &.addCarouseItem {
          height: 400px;
          font-size: 40px;
          position: relative;
          text-align: center;
          width: 15%;
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
  span {
    cursor: pointer;
    color: @default_color;
    margin-left: 20px;
  }
}
</style>
