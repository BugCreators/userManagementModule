<template>
  <!-- <div style="padding-top:0px" v-if="$store.state.setting != ''"> -->
  <div class="collegePage">
    <!-- 顶部banner -->
    <Carousel />
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
import Carousel from "../components/Carousel";

export default {
  name: "collegeListPage",
  components: {
    Carousel,
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
