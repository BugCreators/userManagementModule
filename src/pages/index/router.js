import Vue from "vue";
import Router from "vue-router";
import CollegeListPage from "./subPages/CollegeListPage.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "collegeListPage",
      component: CollegeListPage
    },
    {
      path: "/college/:id",
      name: "collegeDetail",
      component: () =>
        import(/* webpackChunkName: "collegeDetail" */ "./subPages/CollegeDetailPage.vue")
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
