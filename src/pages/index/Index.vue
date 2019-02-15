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
// import { Loading, MessageBox } from "element-ui"

export default {
  name: "index",
  components: {
    AvueHeader,
    AvueFooter
  },
  data() {
    return {
      setting: ``,
      LoadingOpts: {
        fullscreen: true
      }
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  created() {
    let that = this;
    // let loadingInstance = Loading.service(this.LoadingOpts);
    that.$store.dispatch("getUserInfo").then(() => {
      this.$store.dispatch("getItems", {
        url: this.$store.state.getSysSetting,
        cb(res) {
          // loadingInstance.close();
          if (res.success) {
            that.setting = res.data;
            that.$store.commit("setSetting", res.data);
          } else {
            // MessageBox.alert(`读取系统配置出错，请联系管理员`, `系统出错`, {
            //   type: `error`,
            //   confirmButtonText: `确定`
            // });
          }
        }
      });
    });
  }
};
</script>
