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
    <CollegeList
      v-if="collegeListExcel"
      :collegeListExcel="collegeListExcel"
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
import CollegeList from "./CollegeList";
import XLSX from "xlsx";

export default {
  name: "collegeBatchImport",
  components: {
    CollegeList,
    elButton: Button,
    elDialog: Dialog,
    elUpload: Upload
  },
  data() {
    return {
      collegeListExcel: [],
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
    templateDownload() {},
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
            sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
          }
          sheetArray.forEach(item => {
            that.isImport = false;
            if (!item.name) {
              item.message = "学院名不能为空！";
              that.isImport = true;
            }
            that.collegeListExcel.push(item);
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
      this.collegeListExcel = [];
      this.isImport = true;
    },
    importExcel() {
      let loadingInstance = Loading.service({
        text: "导入中，请稍候···"
      });
      this.$store.dispatch("postArrItems", {
        url: this.$store.state.batchAddCollege,
        query: {
          collegeList: this.collegeListExcel,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          this.$nextTick(() => {
            loadingInstance.close();
          });
          if (res.success) {
            Message.success({
              message: "导入成功！"
            });
          } else {
            Message.error({
              message: "导入失败，请稍候重试！"
            });
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
