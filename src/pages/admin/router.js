import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "admin",
      component: () =>
        import(/* webpackChunkName: "collegeManagement" */ "./subPages/CollegeManagement/CollegeManagement"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/collegeManagement",
      name: "collegeManagement",
      component: () =>
        import(/* webpackChunkName: "collegeManagement" */ "./subPages/CollegeManagement/CollegeManagement"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/departmentManagement",
      name: "departmentManagement",
      component: () =>
        import(/* webpackChunkName: "departmentManagement" */ "./subPages/DepartmentManagement/DepartmentManagement"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/classManagement",
      name: "classManagement",
      component: () =>
        import(/* webpackChunkName: "classManagement" */ "./subPages/ClassManagement/ClassManagement"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/setting",
      name: "setting",
      component: () =>
        import(/* webpackChunkName: "setting" */ "./subPages/Setting/Setting"),
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
