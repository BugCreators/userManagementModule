<template>
  <div>
    <!-- 导航栏 -->
    <AvueHeader :isAdmin="false" />
    <!-- 路由视图 -->
    <RouterView />
    <!-- 页脚 -->
    <AvueFooter />
  </div>
</template>

<script>
import AvueHeader from "@/components/AvueHeader";
import AvueFooter from "@/components/AvueFooter";
import { Loading, MessageBox } from "element-ui";
import { mapActions, mapMutations } from "vuex";

export default {
  name: "index",
  components: {
    AvueHeader,
    AvueFooter
  },
  created() {
    let loading = Loading.service();
    this.getUserInfo().then(() => {
      this.getItems({
        url: this.$store.state.getSysSetting,
        cb: res => {
          loading.close();
          if (res.code === 200) {
            this.setSetting(res.data);
          } else {
            MessageBox.alert(`读取系统配置出错，请稍候重试`, `系统出错`, {
              type: `error`,
              confirmButtonText: `确定`
            });
          }
        }
      });
    });
  },
  methods: {
    ...mapActions(["getUserInfo", "getItems"]),
    ...mapMutations(["setSetting"])
  }
};
</script>
