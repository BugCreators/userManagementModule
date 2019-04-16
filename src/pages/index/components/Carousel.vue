<template>
  <el-carousel class="poster" height="320px" type="card">
    <el-carousel-item v-for="item in $store.state.setting.carousel">
      <a :href="item.href">
        <AvueImage
          :srcImage="logoUrl(item.src)"
          :replaceImage="$store.state.defaultBanner"
        />
      </a>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { Carousel, CarouselItem } from "element-ui";
import AvueImage from "@/components/AvueImage";

export default {
  name: "carousel",
  components: {
    AvueImage,
    elCarousel: Carousel,
    elCarouselItem: CarouselItem
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
}
</script>

<style lang="less" scope>
.poster {
  margin-top: 20px;
  text-align: center;
}
</style>