<template>
  <!-- <div class="footer">{{setting.copyright || 'Copyright © 2019 xxx All Rights Reserved'}}&nbsp;{{setting.icp || ''}}</div> -->
  <div class="footer">Copyright © 2019 黄子敦 All Rights Reserved | <a href="http://www.miitbeian.gov.cn/">粤ICP备19041292号-1</a></div>
</template>

<script>
// import $ from "jquery";

export default {
  name: "avueFooter",
  computed: {
    setting: function() {
      return this.$store.state.setting;
    }
  },
  mounted() {
    //$(".content").css("min-height", $(window).height() - 80 + "px");
  }
};
</script>

<style lang="less">
.footer {
  color: #aaa;
  font-size: 12px;
  height: @footer_height;
  line-height: @footer_height;
  text-align: center;
}
</style>
