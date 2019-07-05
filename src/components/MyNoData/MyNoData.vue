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
  }
};
</script>

<style lang="less" src="./MyNoData.less"></style>
