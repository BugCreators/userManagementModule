// 路由拦截器
export default function(router) {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(res => res.meta.requireAuth)) {
      console.log("interceptor is running");
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
}
