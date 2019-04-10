const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin"); //Gzip

module.exports = {
  // process.env.NODE_ENV === 'production' (打包环境)

  /*  
    默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 https://www.my-app.com/
    如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径
    例如，如果你的应用被部署在 https://www.my-app.com/my-app/，则设置 publicPath 为 /my-app/
  */

  publicPath:
    // process.env.NODE_ENV === "production"
    //   ? "Project/user-management-module/dist"
    //   : 
      "/", // 项目部署的基础路径 baseUrl

  /* 注意目标目录在构建之前会被清除 (构建时传入 --no-clean 可关闭该行为) */

  outputDir: "dist", // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录

  assetsDir: "static", // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录

  indexPath: "index.html", // 指定生成的 index.html 的输出路径 (相对于 outputDir)

  /* 
    每个“page”应该有一个对应的 JavaScript 入口文件。其值应该是一个对象，对象的 key 是入口的名字，value 是：
      一个指定了 entry, template, filename, title 和 chunks 的对象 (除了 entry 之外都是可选的)
      或一个指定其 entry 的字符串
  */

  //pages: undefined,  // 在 multi-page 模式下构建应用
  pages: {
    index: {
      // page 的入口
      entry: "src/pages/index/index.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "Avue"
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk
      // chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    // 当使用只有入口的字符串格式时，
    // 模板会被推导为 `public/subpage.html`
    // 并且如果找不到的话，就回退到 `public/index.html`
    // 输出文件名会被推导为 `subpage.html`
    // subpage: 'src/pages/index/main.js'
    login: {
      entry: "src/pages/login/index.js",

      title: "Avue - 登录"
    },
    admin: {
      entry: "src/pages/admin/index.js",

      title: "Avue - 用户管理"
    }
  },

  lintOnSave: process.env.NODE_ENV !== "production", // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码

  // 设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右

  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本

  productionSourceMap: false, // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建

  /*******************************************************************************************************************/

  //                                                      webpack配置

  // https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7
  // https://github.com/neutrinojs/webpack-chain#getting-started

  // chainWebpack: config => {
  // 对内部的 webpack 配置进行更细粒度的修改
  // if (process.env.NODE_ENV === 'production') {
  //   // 为生产环境修改配置
  // } else {
  //   // 为开发环境修改配置
  // }
  // },

  /* 
    如果这个值是一个对象，则会通过 webpack-merge 合并到最终的配置中
    如果这个值是一个函数，则会接收被解析的配置作为参数
      该函数及可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本
  */
  // https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F

  configureWebpack: config => {
    let pluginsPro = [
      //生产环境
      new CompressionPlugin({
        // 文件开启Gzip
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
        threshold: 8192,
        minRatio: 0.8
      })
    ];
    let pluginsDev = [
      //开发环境
    ];
    if (process.env.NODE_ENV) {
      // 为生产环境修改配置
      config.plugins = [...config.plugins, ...pluginsPro];
    } else {
      // 为开发环境修改配置
      config.plugins = [...config.plugins, ...pluginsDev];
    }
  },
  /*******************************************************************************************************************/

  css: {
    modules: false, // 启用 CSS modules，https://cli.vuejs.org/zh/guide/css.html#postcss

    extract: true, // 是否使用css分离插件

    sourceMap: false, // 是否为 CSS 开启 source map

    // https://cli.vuejs.org/zh/guide/css.html#%E5%90%91%E9%A2%84%E5%A4%84%E7%90%86%E5%99%A8-loader-%E4%BC%A0%E9%80%92%E9%80%89%E9%A1%B9

    loaderOptions: {
      // css预设器配置项
      // less: {
      //   data: `@import "@/assets/css/common.less";`
      // }
    }
  },

  /************************************************************************************/
  // webpack-dev-serve相关配置 https://webpack.docschina.org/configuration/dev-server/

  devServer: {
    host: "localhost",

    port: 8080, // 端口号

    https: false,

    open: true, // 自动启动浏览器

    hotOnly: true, // 热更新

    headers: { "Access-Control-Allow-Origin": "*" },

    proxy: null
    // proxy: null
  },
  /************************************************************************************/

  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/assets/css/variables.less")]
    }
  }
};
