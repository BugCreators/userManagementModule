<template>
  <div class="footer">
    Copyright © 2019 黄子敦 All Rights Reserved |
    <a href="http://www.miitbeian.gov.cn/">粤ICP备19041292号-1</a>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "avueFooter",
  computed: {
    ...mapState({
      setting: state => state.setting
    })
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
