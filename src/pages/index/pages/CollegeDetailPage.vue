<template>
  <div class="college-detail-page">
    <el-breadcrumb separator=">" class="bread">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item>学院简介</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="college-info">
      <div class="detail">
        <!-- <AvueImage
          v-if="info != ''" -->
        <div class="basis">
          <AvueImage
            :srcImage="info.logo || $store.state.defaultCollege"
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
            <!-- <span v-if="info.website" class="college-otherInfo">
              官网链接：
              <a :href="info.website">{{ info.website }}</a>
            </span> -->
          </div>
        </div>
        <div id="college-des">
          {{ info.description ? info.description : "暂无概况~" }}
        </div>
        <div class="showMore" v-if="isShow" @click="showMore">
          <span :class="[!isShowMore ? `icon-expand` : `icon-fold`]"></span>
          {{ !isShowMore ? `显示` : `隐藏` }}
        </div>
      </div>
    </div>
    <div class="college-major">
      <div class="detail">
        <h1>专业设置</h1>
        <MajorList :majorList="info.majorList" />
        <myNoData v-if="info.majorList == null" />
      </div>
    </div>
  </div>
</template>

<script>
import { Breadcrumb, BreadcrumbItem, MessageBox } from "element-ui";
import AvueImage from "@/components/AvueImage";

export default {
  name: "collegeDetailPage",
  components: {
    elBreadcrumb: Breadcrumb,
    elBreadcrumbItem: BreadcrumbItem,
    AvueImage,
    MajorList: () =>
      import(/* webpackChunkName: "majorList" */ "../components/CollegeDetailMajorList"),
    MyNoData: () =>
      import(/* webpackChunkName: "myNoData" */ "@/components/MyNoData")
  },
  data() {
    return {
      collegeId: this.$route.params.id,
      info: {
        name: ``,
        website: ``,
        description: ``,
        majorList: []
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
    getCollegeDetail(id) {
      var that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.getCollegeDetail,
        query: {
          id: id ? id : this.collegeId
        },
        cb(res) {
          if (res.code === 200) {
            that.info = res.data;
            that.isShow = false; // true
          } else {
            MessageBox.alert(res.msg, res.code + `错误`, {
              type: `error`,
              confirmButtonText: `确定`,
              callback() {
                location.href = "/index.html";
              }
            });
          }
        }
      });
    },
    showMore() {
      let el = document.getElementById("college-des");
      if (this.isShowMore) {
        el.style.display = `-webkit-box`;
        this.isShowMore = false;
      } else {
        el.style.display = `block`;
        this.isShowMore = true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.college-detail-page {
  padding-top: @header_height;
  .detail {
    background-color: white;
    margin: 0 auto;
    width: @content_width;
    .basis {
      overflow: hidden;
    }
    #college-des {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      font-size: 16px;
      margin-top: 15px;
      overflow: hidden;
      text-indent: 2em;
    }
    .detail-right {
      text-align: left;
      span {
        display: block;
        margin-bottom: 6px;
        &.college-name {
          font-size: 22px;
        }
        &.college-otherInfo {
          color: @default_text_color;
        }
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
    .showMore {
      color: @default_color;
      cursor: pointer;
      font-size: 14px;
      margin-bottom: 5px;
      span {
        background: no-repeat url("../../../assets/images/icon/expand.png");
        display: inline-block;
        height: 10px;
        margin-right: 5px;
        transition: all 0.3s ease 0s;
        width: 14px;
        &.icon-fold {
          transform: rotate(180deg);
        }
      }
    }
  }
  .college-info {
    background: white;
    overflow: hidden;
    padding: 30px 0;
    .college-img {
      float: left;
      height: 200px;
      margin-right: 50px;
    }
  }
  .college-major {
    background: white;
    height: 500px;
    margin: 20px auto 0;
    overflow: hidden;
    padding: 20px 0;
    h1 {
      border-left: 4px solid @default_color;
      font-size: 20px;
      font-weight: normal;
      height: 20px;
      line-height: 16px;
      margin-top: 8px;
      padding-left: 10px;
      text-align: left;
    }
  }
}
</style>
