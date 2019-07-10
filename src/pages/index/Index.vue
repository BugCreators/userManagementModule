<template>
  <div>
    <!-- 导航栏 -->
    <AvueHeader />
    <!-- 路由视图 -->
    <RouterView />
    <!-- 页脚 -->
    <AvueFooter />
  </div>
</template>

<script>
import AvueHeader from "@/components/AvueHeader/AvueHeader";
import AvueFooter from "@/components/AvueFooter/AvueFooter";
import { Loading } from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "index",
  components: {
    AvueHeader,
    AvueFooter
  },
  async created() {
    const loading = Loading.service();
    await this.getUserInfo();
    const res = await this.$http.getSysSetting();
    loading.close();
    if (res.code === 200) {
      this.setSetting(res.data);
    } else {
      avueMsgBox(
        {
          message: "读取系统配置出错，请稍候重试",
          title: "系统出错"
        },
        2
      );
    }
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    ...mapMutations(["setSetting"])
  }
};
</script>
