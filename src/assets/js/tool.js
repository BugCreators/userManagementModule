// 解析url参数
function getUrlParam(name) {
  let url = window.location.search;
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let result = url.substr(1).match(reg);
  return result ? decodeURIComponent(result[2]) : null;
}
export { getUrlParam };
