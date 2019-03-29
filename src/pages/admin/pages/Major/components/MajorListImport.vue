<template>
  <el-dialog
    :before-close="closeImportLog"
    :title="title"
    :visible.sync="showImportLog"
  >
    <div style="position: relative;">
      <el-button type="primary" @click="templateDownload">
        <i class="el-icon-download"></i>
        下载模板
      </el-button>
      <el-upload
        accept=".xls,.xlsx"
        action="111"
        class="excelUpload"
        :auto-upload="false"
        :limit="1"
        :on-change="readExcel"
        :on-remove="removeExcel"
      >
        <el-button slot="trigger" type="primary">
          <i class="el-icon-upload"></i>
          导入文件
        </el-button>
      </el-upload>
      <div class="el-upload__tip importTip">
        只能上传xls/xlsx文件
      </div>
    </div>
    <MajorList
      v-if="listExcel"
      :listExcel="listExcel"
      :isImport="true"
    />
    <div class="logWarp">
      <el-button type="primary" @click="importExcel" :disabled="isImport"
        >导入</el-button
      >
      <el-button @click="closeImportLog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Button, Dialog, Loading, Message, Upload } from "element-ui";
import MajorList from "./MajorList";
import XLSX from "xlsx";
import { downloadExl, changeExlHaed } from "@/assets/js/tool";

export default {
  name: "majorBatchImport",
  components: {
    MajorList,
    elButton: Button,
    elDialog: Dialog,
    elUpload: Upload
  },
  data() {
    return {
      listExcel: [],
      i18n: {
        name: "学院名",
        en_name: "英文名",
        website: "学院官网",
        description: "学院描述"
      },
      title: "批量导入",
      isImport: true // 导入按钮点击状态
    };
  },
  computed: {
    showImportLog() {
      return this.$store.state.showImportLog;
    }
  },
  methods: {
    closeImportLog() {
      this.$store.commit("switchImportLog");
    },
    templateDownload() {
      let listHead = new Object,
        listHeadArr = new Array;
      Object.keys(this.i18n).forEach(v => {
        listHead[this.i18n[v]] = "";
      });
      listHeadArr.push(listHead);
      downloadExl(listHeadArr, "xlsx", "专业列表模板");
    },
    readExcel(file) {
      const xls = "application/vnd.ms-excel",
        xlsx =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (file.raw.type !== xls && file.raw.type !== xlsx) {
        Message.error({
          message: "请选择Excel格式的文件！"
        });
        return false;
      }
      const fileReader = new FileReader();
      let that = this;
      fileReader.onload = ev => {
        try {
          let sheetArray;
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          for (let sheet in workbook.Sheets) {
            changeExlHaed(workbook.Sheets[sheet], Object.keys(that.i18n));
            sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
          };
          sheetArray.forEach(item => {
            that.isImport = false;
            if (!item.name) {
              item.message = "专业名不能为空！";
              that.isImport = true;
            }
            that.listExcel.push(item);
          });
        } catch (e) {
          Message.error({
            message: "文件类型不正确！"
          });
          return false;
        }
      };
      fileReader.readAsBinaryString(file.raw);
    },
    removeExcel() {
      this.listExcel = [];
      this.isImport = true;
    },
    importExcel() {
      let that = this;
      let loading = Loading.service({
        text: "导入中，请稍候···"
      });
      this.$store.dispatch("postItems", {
        url: this.$store.state.importMajorList,
        query: {
          majorList: this.listExcel,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            Message.success(res.msg);
            that.$emit("listChange");
            that.closeImportLog();
          } else {
            Message.error(res.msg);
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
.excelUpload {
  display: inline-block;
  margin-left: 10px;
  .el-upload-list {
    float: right;
  }
}
.importTip {
  bottom: 0;
  display: inline-block;
  margin-left: 10px;
  position: absolute;
}
.logWarp {
  overflow: hidden;
  button {
    float: right;
    margin-left: 10px;
  }
}
</style>
