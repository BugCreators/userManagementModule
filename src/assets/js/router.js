import Router from "vue-router";
import routerInterceptor from "./routerInterceptor";
import indexRouter from "@/pages/index/router";
import loginRouter from "@/pages/login/router";
import adminRouter from "@/pages/admin/router";

export default function() {
  let router = new Router({
    routes: []
  });
  //路由拦截
  routerInterceptor(router);
  //加载各模块的路由
  indexRouter(router);
  loginRouter(router);
  adminRouter(router);
  return router;
}
