import Vue from "vue";
import Login from "./Login.vue";
import "../../assets/css/common.less";
import router from "./router";
import store from "@/assets/js/store";

import "@/assets/js/http/api/login";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(Login)
}).$mount("#app");
