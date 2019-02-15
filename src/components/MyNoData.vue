<template>
  <div class="myNoData">
    <img :src="$store.state.defaultNoData" alt />
    <p>{{ hint }}</p>
  </div>
</template>

<script>
export default {
  name: "myNoData",
  props: {
    hint: {
      type: String,
      default: "暂无内容，空空如也~"
    }
  },
  mounted() {}
};
</script>

<style lang="less">
.myNoData {
  text-align: center !important;
  padding: 200px 0;
  img {
    display: inline-block !important;
  }
  p {
    padding: 20px 0;
    font-size: 14px;
    color: #bbb;
  }
}
</style>
