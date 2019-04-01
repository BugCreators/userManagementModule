<template>
  <div class="college-info">
    <div class="college-header">
      <div class="line"></div>
      <div class="college-type">
        <img src="@/assets/images/college_list.png" alt />
        <span class="title">学院列表</span>
      </div>
      <div class="line"></div>
    </div>
    <div class="college-list">
      <el-row :gutter="26">
        <el-col v-for="item in list" :span="3" :key="item.id">
          <a class="college-card" :href="'index.html#/college/' + item.id">
            <AvueImage
              :srcImage="logoUrl(item.logo)"
              :replaceImage="$store.state.defaultCollege"
              :class="['college-cover']"
            />
            <div class="cover-title">
              <span>{{ item.name }}</span>
            </div>
          </a>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { Row, Col } from "element-ui";
import AvueImage from "@/components/AvueImage";

export default {
  name: "collegeList",
  components: {
    AvueImage,
    elRow: Row,
    elCol: Col
  },
  props: {
    list: {
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    logoUrl(url) {
      if (url == "" || url == null) {
        return this.$store.state.defaultCollege;
      } else {
        return this.$store.state.baseUrl + url;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.college-info {
  .college-header {
    display: inline-block;
    width: 100%;
    .line {
      border-top: 1px solid #ccc;
      display: inline-block;
      height: 1px;
      width: 34%;
    }
    .college-type {
      display: inline-block;
      margin: 0 70px;
      img {
        height: 42px;
        margin-right: 10px;
        width: 42px;
        vertical-align: top;
      }
      .title {
        color: #4b4b4b;
        display: inline-block;
        font-size: 40px;
        letter-spacing: 5px;
        line-height: 1;
        white-space: nowrap;
      }
    }
  }
  .college-list {
    padding-top: 70px;
    .college-card {
      background: #fff;
      border-radius: 3px;
      display: inline-block;
      height: 128px;
      margin-bottom: 20px;
      overflow: hidden;
      position: relative;
      width: 128px;
      .college-cover {
        height: 128px;
        width: 128px;
      }
      .cover-title {
        background: rgba(0, 0, 0, 0.8);
        color: #fff;
        display: table;
        font-size: 16px;
        height: 128px;
        position: absolute;
        text-align: center;
        top: 128px;
        width: 128px;
        span {
          display: table-cell;
          height: 0;
          overflow: hidden;
          padding: 0 20px;
          vertical-align: middle;
        }
      }
      &:hover {
        .cover-title {
          display: table;
          top: 0;
          transform: translateY(0);
          transition: all 0.5s ease 0s;
        }
      }
    }
  }
}
</style>
