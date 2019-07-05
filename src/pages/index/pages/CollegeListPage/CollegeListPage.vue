<template>
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
import Carousel from "../../components/Carousel/Carousel";

export default {
  name: "collegeListPage",
  components: {
    Carousel,
    CollegeList: () =>
      import(/* webpackChunkName: "collegeList" */ "../../components/CollegeList/CollegeList"),
    MyNoData: () =>
      import(/* webpackChunkName: "myNoData" */ "@/components/MyNoData/MyNoData")
  },
  data() {
    return {
      collegeList: []
    };
  },
  created() {
    this.getCollegeList();
  },
  methods: {
    async getCollegeList() {
      const { data: res } = await this.$http.getCollegeList();
      if (res.code === 200) {
        this.collegeList = res.data;
      }
    }
  }
};
</script>

<style lang="less" src="./CollegeListPage.less" scoped></style>
