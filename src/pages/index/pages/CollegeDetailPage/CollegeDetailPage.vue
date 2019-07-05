<template>
  <div class="college-detail-page">
    <el-breadcrumb separator=">" class="bread">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学院简介</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="college-info">
      <div class="detail">
        <div class="basis">
          <AvueImage
            :srcImage="logoUrl(info.logo)"
            :replaceImage="$store.state.defaultCollege"
            :class="['college-img']"
          />
          <div class="detail-right">
            <span class="college-name">{{ info.name }}</span>
            <span v-if="info.english_name" class="college-otherInfo">{{
              info.english_name
            }}</span>
            <span class="college-otherInfo">
              <a :href="info.website">进入学院官网→</a></span
            >
          </div>
        </div>
        <div id="college-des">
          {{ info.description || "暂无概况~" }}
        </div>
        <div class="showMore" v-if="isShow" @click="showMore">
          <span :class="[!isShowMore ? `icon-expand` : `icon-fold`]"></span>
          {{ !isShowMore ? `显示` : `隐藏` }}
        </div>
      </div>
    </div>
    <div class="college-major" v-if="info.major.length">
      <div class="detail">
        <h1>专业设置</h1>
        <MajorList :majorList="info.major" />
      </div>
    </div>
  </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem } from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import AvueImage from "@/components/AvueImage/AvueImage";

export default {
  name: "collegeDetailPage",
  components: {
    elBreadcrumb: Breadcrumb,
    elBreadcrumbItem: BreadcrumbItem,
    AvueImage,
    MajorList: () =>
      import(/* webpackChunkName: "majorList" */ "../../components/CollegeDetailMajorList/CollegeDetailMajorList")
  },
  data() {
    return {
      collegeId: this.$route.params.id,
      info: {
        name: ``,
        website: ``,
        description: ``,
        major: []
      },
      isShow: false,
      isShowMore: false
    };
  },
  created() {
    this.getCollegeDetail();
  },
  watch: {
    "$route.path": function() {
      this.getCollegeDetail(this.$route.params.id);
    }
  },
  methods: {
    async getCollegeDetail(id) {
      const { data: res } = await this.$http.getCollegeDetail({
        id: id || this.collegeId
      });
      if (res.code === 200) {
        this.info = res.data;
        if (res.data.description.length > 245) {
          this.isShow = true;
        }
      } else {
        avueMsgBox(
          {
            message: res.msg,
            title: `${res.code}错误`
          },
          2
        ).then(() => (location.href = "/index.html"));
      }
    },
    showMore() {
      const el = document.getElementById("college-des");
      if (this.isShowMore) {
        el.style.display = `-webkit-box`;
      } else {
        el.style.display = `block`;
      }
      this.isShowMore = !this.isShowMore;
    },
    logoUrl(url) {
      return url === "" || url === null
        ? this.$store.state.defaultCollege
        : this.$store.state.baseUrl + url;
    }
  }
};
</script>

<style lang="less" src="./CollegeDetailPage.less" scoped></style>
