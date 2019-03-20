<template>
  <!-- <div style="padding-top:0px" v-if="$store.state.setting != ''"> -->
  <div class="collegePage" ref="collegePage">
    <!-- 顶部banner -->
    <div class="poster">
      <a
        :href="
          $store.state.setting.bannerHref
            ? $store.state.setting.bannerHref
            : '#'
        "
      >
        <AvueImage
          :srcImage="
            $store.state.setting.bannerUri
              ? $store.state.setting.bannerUri
              : $store.state.defaultBanner
          "
          :replaceImage="$store.state.defaultBanner"
        />
      </a>
    </div>
    <!-- 学院列表 -->
    <div class="college-wrapper">
      <div class="container">
        <CollegeList :list="collegeList" />
        <myNoData v-if="!collegeList || collegeList.length <= 0" />
      </div>
    </div>
  </div>
</template>

<script>
import AvueImage from "@/components/AvueImage";

export default {
  name: "collegeListPage",
  components: {
    AvueImage,
    CollegeList: () =>
      import(/* webpackChunkName: "collegeList" */ "../components/CollegeList"),
    MyNoData: () =>
      import(/* webpackChunkName: "myNoData" */ "@/components/MyNoData")
  },
  data() {
    return {
      collegeList: []
    };
  },
  created() {
    let that = this;
    this.$store.dispatch("getItems", {
      url: this.$store.state.getCollegeList,
      cb(res) {
        if (res.code === 200) {
          that.collegeList = res.data;
        }
      }
    });
  }
};
</script>

<style lang="less" scoped>
.collegePage {
  overflow: hidden;
  padding-top: @header_height;
  .poster {
    margin: 0 auto;
    height: 428px;
    background-color: #aaa;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .college-wrapper {
    background: url("../../../assets/images/college_background.png") no-repeat
      center center;
    padding-top: 50px;
    .container {
      width: @content_width;
      margin: 0 auto;
    }
  }
  .myNoData {
    padding: 100px 0;
  }
}
</style>
