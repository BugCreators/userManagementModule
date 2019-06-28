import Vue from "vue";
import Admin from "./Admin.vue";
import "../../assets/css/common.less";
import router from "./router";
import store from "@/assets/js/store";

import "@/assets/js/http/api/admin";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(Admin)
}).$mount("#app");
