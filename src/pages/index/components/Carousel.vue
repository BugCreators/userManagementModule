<template>
  <AvueImage
    v-if="!$store.state.setting.carousel.length"
    :srcImage="$store.state.defaultBanner"
  />
  <el-carousel class="poster" height="320px" type="card" v-else>
    <el-carousel-item
      v-for="(item, index) in $store.state.setting.carousel"
      :key="index"
    >
      <a :href="item.href">
        <AvueImage
          :srcImage="logoUrl(item.url)"
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
      return url == "" || url == null
        ? this.$store.state.defaultCollege
        : this.$store.state.baseUrl + url;
    }
  }
};
</script>

<style lang="less" scope>
.poster {
  margin-top: 20px;
  text-align: center;
}
</style>
