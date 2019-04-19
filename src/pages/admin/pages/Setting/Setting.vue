<template>
  <div class="setting mg--20">
    <div class="setting-page">
      <el-form :model="setting">
        <el-form-item :label="i18n.schoolInfo">
          <SchoolInfoCard
            v-if="setting.schoolInfo.index"
            :schoolInfo="setting.schoolInfo"
          />
        </el-form-item>
        <el-form-item :label="i18n.systemWebsite">
          <OtherSystemCard
            v-for="item in setting.systemWebsite"
            :key="item.index"
            :system="item"
            @settingChange="settingChange"
          />
          <el-card class="addCard addCard-system" type="addCard">
            <span
              class="el-icon-circle-plus-outline addButton"
              @click="openSystemLog"
            ></span>
          </el-card>
        </el-form-item>
        <el-form-item :label="i18n.carousel + '（最多6张）'">
          <CarouselCard
            v-for="item in setting.carousel"
            class="carouselCard"
            :key="item.index"
            :item="item"
            @settingChange="settingChange"
            @deleteItem="deleteItem"
            @openLog="openCarouselLog"
          />
          <el-card
            v-if="setting.carousel.length < 6"
            class="addCard addCard-carousel"
            type="addCard"
          >
            <span
              class="el-icon-circle-plus-outline addButton"
              @click="openCarouselLog()"
            ></span>
          </el-card>
        </el-form-item>
      </el-form>
      <OtherSystemLog
        v-if="showSystemLog"
        :showLog="showSystemLog"
        @settingChange="settingChange"
        @closeLog="closeLog"
      />
      <CarouselLog
        v-if="showCarouselLog"
        :dataIndex="currentCarouseIndex"
        :showLog="showCarouselLog"
        @settingChange="settingChange"
        @closeLog="closeLog"
      />
    </div>
  </div>
</template>

<script>
import { Card, Form, FormItem, Loading, MessageBox } from "element-ui";

export default {
  name: "sysSetting",
  components: {
    CarouselCard: () =>
      import(/* webpackChunkName: "carouselCard" */ "./components/CarouselCard"),
    CarouselLog: () =>
      import(/* webpackChunkName: "carouselLog" */ "./components/CarouselLog"),
    elCard: Card,
    elForm: Form,
    elFormItem: FormItem,
    OtherSystemCard: () =>
      import(/* webpackChunkName: "otherSystemCard" */ "./components/OtherSystemCard"),
    OtherSystemLog: () =>
      import(/* webpackChunkName: "otherSystemLog" */ "./components/OtherSystemLog"),
    SchoolInfoCard: () =>
      import(/* webpackChunkName: "schoolInfoCard" */ "./components/SchoolInfoCard")
  },
  data() {
    return {
      setting: {
        schoolInfo: {
          name: ``,
          address: ``
        },
        carousel: [],
        systemWebsite: []
      },
      i18n: {
        schoolInfo: `学校信息`,
        carousel: `轮播图`,
        href: `链接`,
        systemWebsite: `其它系统`
      },
      showSystemLog: false,
      showCarouselLog: false,
      currentCarouseIndex: ""
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
    openSystemLog() {
      this.showSystemLog = true;
    },
    openCarouselLog(index) {
      this.currentCarouseIndex = index;
      this.showCarouselLog = true;
    },
    closeLog() {
      this.currentCarouseIndex = "";
      this.showCarouselLog = false;
      this.showSystemLog = false;
    },
    deleteItem(index) {
      this.setting.carousel.splice(index, 1);
    },
    settingChange() {
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
        max-width: 450px;
        width: 25%;
        &.systemCard {
          max-height: 240px;
        }
        &.carouselCard {
          max-height: 400px;
        }
        .el-input {
          width: 85%;
        }
        &:not([type="addCard"]) {
          &:nth-child(4) {
            margin-left: 5em;
          }
        }
        &.addCard {
          font-size: 40px;
          position: relative;
          text-align: center;
          width: 15%;
          &-system {
            height: 240px;
          }
          &-carousel {
            height: 400px;
          }
        }
      }
    }
  }
}
.editButton {
  display: inline-block;
  margin-left: 20px;
}
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
</style>
