<template>
  <div class="majorList">
    <div 
      class="majorListItem" 
      v-for="item in majorList" 
      :key="item.id"
    >
      <h2>{{item.name}}专业名 本科</h2>
      <p><strong>培养目标</strong> 哈哈哈哈哈哈哈哈哈</p>
      <p><strong>主要课程</strong> 哈哈哈哈哈哈哈哈哈哈</p>
      <p><strong>就业方向</strong> 哈哈哈哈哈哈哈哈哈哈</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "majorList",
  props: {
    majorList: {}
  }
};
</script>

<style lnag="less" scoped>
.majorList {
  padding-top: 25px;
  text-align: center;
}
.majorListItem {
  margin-bottom: 25px;
}
</style>
