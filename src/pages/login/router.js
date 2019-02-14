import Vue from "vue";
import Router from "vue-router";
import Login from "./Login.vue";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: Login,
      meta: {
        requireAuth: true
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {
    if (document.cookie.indexOf("avueUser") == -1) {
      next();
    } else {
      window.history.go(-1);
    }
  } else {
    next();
  }
});
export default router;
