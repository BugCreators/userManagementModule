import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "collegeListPage",
      component: () =>
        import(/* webpackChunkName: "collegeListPage" */ "./pages/CollegeListPage")
    },
    {
      path: "/college/:id",
      name: "collegeDetail",
      component: () =>
        import(/* webpackChunkName: "collegeDetail" */ "./pages/CollegeDetailPage")
    },
    {
      path: "/userInfo",
      name: "userInfo",
      component: () =>
        import(/* webpackChunkName: "userInfo" */ "./pages/UserInfo")
    },
    {
      path: "/changePw",
      name: "changePassword",
      component: () =>
        import(/* webpackChunkName: "changePw" */ "./pages/ChangePassword")
    },
    {
      path: "/login",
      name: "login",
      beforeEnter() {
        window.location = "/login.html";
      }
    },
    {
      path: "/admin",
      name: "admin",
      meta: {
        requireAuth: true
      },
      beforeEnter() {
        window.location = "/admin.html";
      }
    }
  ]
});
