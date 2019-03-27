<template>
  <div class="majorList">
    <div class="majorListItem" v-for="item in majorList" :key="item.id">
      <h2 class="majorName">{{ item.name }} {{ item.level }}</h2>
      <el-collapse>
        <div v-for="(value, key, index) in i18n" :key="index">
          <el-collapse-item v-if="item[key]" :title="value" :name="index">
            <div class="majorInfo">{{ item[key] }}</div>
          </el-collapse-item>
          <div v-else></div>
        </div>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { Collapse, CollapseItem } from "element-ui";

export default {
  name: "majorList",
  components: {
    elCollapse: Collapse,
    elCollapseItem: CollapseItem
  },
  props: {
    majorList: {}
  },
  data() {
    return {
      i18n: {
        description: "专业概况",
        train_objective: "培养目标",
        main_course: "主要课程",
        employment_direction: "就业方向"
      }
    };
  }
};
</script>

<style lang="less" scoped>
.majorList {
  padding-top: 25px;
}
.majorListItem {
  margin-bottom: 25px;
  .majorName {
    text-align: center;
  }
  .majorInfo {
    text-indent: 2em;
  }
}
.el-collapse-item {
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
