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
            @settingChange="getSysSetting"
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
            @settingChange="getSysSetting"
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
        @settingChange="getSysSetting"
        @closeLog="closeLog"
      />
      <CarouselLog
        v-if="showCarouselLog"
        :dataIndex="currentCarouseIndex"
        :showLog="showCarouselLog"
        @settingChange="getSysSetting"
        @closeLog="closeLog"
      />
    </div>
  </div>
</template>

<script>
import { Card, Form, FormItem, Loading } from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import { mapMutations } from "vuex";

export default {
  name: "sysSetting",
  components: {
    CarouselCard: () =>
      import(
        /* webpackChunkName: "carouselCard" */ "./components/CarouselCard/CarouselCard"
      ),
    CarouselLog: () =>
      import(
        /* webpackChunkName: "carouselLog" */ "./components/CarouselLog/CarouselLog"
      ),
    elCard: Card,
    elForm: Form,
    elFormItem: FormItem,
    OtherSystemCard: () =>
      import(
        /* webpackChunkName: "otherSystemCard" */ "./components/OtherSystemCard/OtherSystemCard"
      ),
    OtherSystemLog: () =>
      import(
        /* webpackChunkName: "otherSystemLog" */ "./components/OtherSystemLog/OtherSystemLog"
      ),
    SchoolInfoCard: () =>
      import(
        /* webpackChunkName: "schoolInfoCard" */ "./components/SchoolInfoCard/SchoolInfoCard"
      )
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
    ...mapMutations(["setSetting"]),
    async getSysSetting() {
      const loading = Loading.service();
      const res = await this.$http.getSysSetting();
      loading.close();
      if (res.code === 200) {
        this.setting = res.data;
        this.setting.carousel = this.setting.carousel.map(item => {
          item.name = item.url.split("/").pop();
          item.url = this.$store.state.baseUrl + item.url;
          return item;
        });
        this.setSetting(res.data);
      } else {
        avueMsgBox(
          {
            message: "读取系统配置出错，请稍候重试",
            title: "系统出错"
          },
          2
        );
      }
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
    }
  }
};
</script>

<style lang="less" src="./Setting.less" scope></style>
