import { MessageBox } from "element-ui";

const avueMsgBox = ({ message, title = "提示" }, type) => {
  let box_type = "warning";
  let confirmButtonText = "确定"; // 确定按钮文本
  let cancelButtonText = "取消"; // 取消按钮文本
  let showCancelButton = true; // 显示取消按钮
  switch (type) {
    case 1:
      confirmButtonText = "回到首页";
      cancelButtonText = "登录";
      break;
    case 2:
      box_type = "error";
      showCancelButton = false;
      break;
    default:
      break;
  }
  return new Promise(function(resolve, reject) {
    MessageBox.confirm(message, title, {
      confirmButtonText,
      cancelButtonText,
      showCancelButton,
      type: box_type
    })
      .then(() => resolve())
      .catch(() => reject());
  });
};
export default avueMsgBox;
