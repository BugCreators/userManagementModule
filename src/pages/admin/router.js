import Vue from "vue";
import Router from "vue-router";
import Home from "./pages/Home/Home";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "admin",
      component: Home
    },
    {
      // 部门管理
      path: "/branch",
      name: "branch",
      component: () =>
        import(/* webpackChunkName: "branch" */ "./pages/Branch/Branch"),
      meta: {
        requireAuth: true
      }
    },
    {
      // 身份管理
      path: "/role",
      name: "role",
      component: () =>
        import(/* webpackChunkName: "role" */ "./pages/Role/Role"),
      meta: {
        requireAuth: true
      }
    },
    {
      // 权限管理
      path: "/authority",
      name: "authority",
      component: () =>
        import(
          /* webpackChunkName: "authority" */ "./pages/Authority/Authority"
        ),
      meta: {
        requireAuth: true
      }
    },
    {
      // 管理员列表
      path: "/administrator",
      name: "administrator",
      component: () =>
        import(
          /* webpackChunkName: "administrator" */ "./pages/Administrator/Administrator"
        ),
      meta: {
        requireAuth: true
      }
    },
    {
      // 学院管理
      path: "/college",
      name: "college",
      component: () =>
        import(/* webpackChunkName: "college" */ "./pages/College/College"),
      meta: {
        requireAuth: true
      }
    },
    {
      // 专业管理
      path: "/major",
      name: "major",
      component: () =>
        import(/* webpackChunkName: "major" */ "./pages/Major/Major"),
      meta: {
        requireAuth: true
      }
    },
    {
      // 院系管理
      path: "/department",
      name: "department",
      component: () =>
        import(
          /* webpackChunkName: "department" */ "./pages/Department/Department"
        ),
      meta: {
        requireAuth: true
      }
    },
    {
      // 班级管理
      path: "/class",
      name: "class",
      component: () =>
        import(/* webpackChunkName: "class" */ "./pages/Class/Class"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/student",
      name: "student",
      component: () =>
        import(/* webpackChunkName: "student" */ "./pages/Student/Student"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/teacher",
      name: "teacher",
      component: () =>
        import(/* webpackChunkName: "teacher" */ "./pages/Teacher/Teacher"),
      meta: {
        requireAuth: true
      }
    },
    {
      // 基本设置
      path: "/setting",
      name: "setting",
      component: () =>
        import(/* webpackChunkName: "setting" */ "./pages/Setting/Setting"),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/login",
      name: "login",
      beforeEnter() {
        location = "/login.html";
      }
    },
    {
      path: "/userInfo",
      name: "userInfo",
      component: () =>
        import(
          /* webpackChunkName: "userInfo" */ "../index/pages/UserInfo/UserInfo"
        ),
      meta: {
        requireAuth: true
      }
    },
    {
      path: "/changePw",
      name: "changePw",
      component: () =>
        import(
          /* webpackChunkName: "changePw" */ "../index/pages/ChangePassword/ChangePassword"
        ),
      meta: {
        requireAuth: true
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
