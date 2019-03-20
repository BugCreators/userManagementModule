import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import(/* webpackChunkName: "login.chunk" */ "./Login"),
      meta: {
        requireAuth: true
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {
    if (document.cookie.indexOf("avueUser=null") !== -1) {
      next();
    } else {
      // window.history.go(-1);
      window.location = "/index.html";
    }
  } else {
    next();
  }
});
export default router;
