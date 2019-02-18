<template>
  <div class="header">
    <div :class="isAdmin ? 'container-admin' : 'container'">
      <h1 class="logo">
        <a href="index.html">
          <AvueImage
            :srcImage="$store.state.defaultLogo"
            :replaceImage="$store.state.defaultLogo"
          />
          <!-- :srcImage="$store.state.setting.logoUri || $store.state.defaultLogo"
            :replaceImage="$store.state.defaultLogo"/> -->
        </a>
      </h1>
    </div>
  </div>
</template>
<script>
import AvueImage from "./AvueImage.vue";

export default {
  name: "AvueHeader",
  components: {
    AvueImage
  },
  props: {
    isAdmin: Boolean
  },
  mounted() {
    if (!this.isAdmin) {
      let navHeight = document.getElementsByClassName("header")[0].offsetHeight;
      window.onscroll = function() {
        let scrolltop =
          document.documentElement.scrollTop || document.body.scrollTop;
        if (scrolltop > navHeight) {
          document.querySelector(".header").classList.add("headerScroll");
        } else {
          document.querySelector(".header").classList.remove("headerScroll");
        }
      };
    }
  }
};
</script>
<style lang="less">
.header {
  background: @header_bg;
  height: @header_height;
  position: fixed;
  width: 100%;
  z-index: 1999;
  .container {
    margin: 0 auto;
    padding: 0;
    width: @content_width;
  }
  .container-admin {
    padding-left: 20px;
  }
  .logo {
    float: left;
    margin: 10px 0 0 0 !important;
    img {
      width: auto;
    }
  }
}
.headerScroll {
  background: url("../assets/images/nav_bg_scroll.png") 0 -20px repeat-x;
}
</style>
