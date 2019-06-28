import Vue from "vue";
import Index from "./Index.vue";
import "../../assets/css/common.less";
import router from "./router";
import store from "@/assets/js/store";

import "@/assets/js/http/api/index";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(Index)
}).$mount("#app");
