import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "collegeListPage",
      component: () =>
        import(/* webpackChunkName: "collegeListPage" */ "./subPages/CollegeListPage")
    },
    {
      path: "/college/:id",
      name: "collegeDetail",
      component: () =>
        import(/* webpackChunkName: "collegeDetail" */ "./subPages/CollegeDetailPage")
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
