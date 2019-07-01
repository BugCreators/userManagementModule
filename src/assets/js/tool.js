import { write, read, utils } from "xlsx";

// 解析url参数
function getUrlParam(name) {
  let url = window.location.search;
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let result = url.substr(1).match(reg);
  return result ? decodeURIComponent(result[2]) : null;
}

/************************导出Excel表格 BEGIN******************************/
// 下载功能
function saveAs(obj, fileName) {
  var tmpa = document.createElement("a");
  tmpa.download = fileName || "未命名";
  // 兼容ie
  if ("msSaveOrOpenBlob" in navigator) {
    window.navigator.msSaveOrOpenBlob(obj, "下载的文件名" + ".xlsx");
  } else {
    tmpa.href = URL.createObjectURL(obj);
  }
  tmpa.click();
  setTimeout(function() {
    URL.revokeObjectURL(obj);
  }, 100);
}
// 配置文件类型
const wopts = {
  bookType: "xlsx",
  bookSST: true,
  type: "binary",
  cellStyles: true
};
function downloadExl(json, type, fileName) {
  let tmpdata = json[0];
  json.unshift({});
  var keyMap = []; //获取keys
  for (let k in tmpdata) {
    keyMap.push(k);
    json[0][k] = k;
  }
  tmpdata = []; //用来保存转换好的json
  json
    .map((v, i) =>
      keyMap.map((k, j) =>
        Object.assign(
          {},
          {
            v: v[k],
            position:
              (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
          }
        )
      )
    )
    .reduce((prev, next) => prev.concat(next))
    .forEach(
      // eslint-disable-next-line
      (v, i) =>
        (tmpdata[v.position] = {
          v: v.v
        })
    );
  var outputPos = Object.keys(tmpdata); //设置区域,比如表格从A1到D10
  // tmpdata["B1"].s = {
  //   font: { sz: 14, bold: true, color: { rgb: "FFFFAA00" } },
  //   fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } }
  // }; //<====设置xlsx单元格样式
  var tmpWB = {
    SheetNames: ["mySheet"], //保存的表标题
    Sheets: {
      mySheet: Object.assign(
        {},
        tmpdata, //内容
        {
          "!ref": outputPos[0] + ":" + outputPos[outputPos.length - 1] //设置填充区域
        }
      )
    }
  };
  let tmpDown = new Blob(
    [
      s2ab(
        write(
          tmpWB,
          {
            bookType: type == undefined ? "xlsx" : type,
            bookSST: false,
            type: "binary"
          } //这里的数据是用来定义导出的格式类型
        )
      )
    ],
    {
      type: ""
    }
  );
  saveAs(
    tmpDown,
    fileName + "." + (wopts.bookType == "biff2" ? "xls" : wopts.bookType)
  );
}
// 获取26个英文字母用来表示excel的列
function getCharCol(n) {
  // eslint-disable-next-line
  let temCol = "",
    s = "",
    m = 0;
  while (n > 0) {
    m = (n % 26) + 1;
    s = String.fromCharCode(m + 64) + s;
    n = (n - m) / 26;
  }
  return s;
}
function s2ab(s) {
  if (typeof ArrayBuffer !== "undefined") {
    let buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  } else {
    let buf = new Array(s.length);
    for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }
}
/************************导出Excel表格 END*********************************/
// 修改头数据
function changeExlHaed(Sheets, header) {
  let i = 0;
  for (let item in Sheets) {
    if (item.charCodeAt() >= 65 && item.indexOf("1") !== -1) {
      Sheets[item].w = header[i - 1];
    }
    i++;
  }
}
export { getUrlParam, downloadExl, changeExlHaed, read, utils };
