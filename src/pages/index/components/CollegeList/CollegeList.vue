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
          <a
            class="college-card"
            :href="'index.html#/college/' + item.id"
            v-if="item.logo"
          >
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
import AvueImage from "@/components/AvueImage/AvueImage";

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
  methods: {
    logoUrl(url) {
      return url === "" || url === null
        ? this.$store.state.defaultCollege
        : this.$store.state.baseUrl + url;
    }
  }
};
</script>

<style lang="less" src="./CollegeList.less" scoped></style>
