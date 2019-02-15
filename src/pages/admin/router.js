import Vue from "vue";
import Router from "vue-router";
import CollegeManagement from "./subPages/CollegeManagement";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "admin",
      // component: Admin,
      component: CollegeManagement,
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/collegeManagement",
      name: "collegeManagement",
      component: () =>
        import(/* webpackChunkName: "collegeManagement" */ "./subPages/CollegeManagement.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/departm entManagement",
      name: "departmentManagement",
      component: () =>
        import(/* webpackChunkName: "departmentManagement" */ "./subPages/DepartmentManagement.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/classManagement",
      name: "classManagement",
      component: () =>
        import(/* webpackChunkName: "classManagement" */ "./subPages/ClassManagement.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/setting",
      name: "setting",
      component: () =>
        import(/* webpackChunkName: "setting" */ "./subPages/Setting.vue"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      beforeEnter() {
        window.location = "/login.html";
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(res => res.meta.requireAuth)) {
    //判断是否需要登录权限
    if (document.cookie.indexOf("avueUser") != -1) {
      // 判断是否登录
      next();
    } else {
      //没登录 则跳转页面
      next({
        path: "/login",
        query: { redirect: to.fullPath }
      });
    }
  } else {
    next();
  }
});
export default router;