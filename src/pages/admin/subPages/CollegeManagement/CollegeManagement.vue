<template>
  <div>
    <h1>学院管理</h1>
    <CollegeList />
  </div>
</template>

<script>
import CollegeList from "./subComponents/CollegeList";

export default {
  name: "college",
  components: {
    CollegeList
  }
};
</script>
