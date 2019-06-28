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
    <ClassList v-if="listExcel" :listExcel="listExcel" :isImport="true" />
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
import ClassList from "./ClassList";
import { downloadExl, changeExlHaed, XLSX } from "@/assets/js/tool";
import { mapMutations, mapState } from "vuex";

export default {
  name: "classListImport",
  components: {
    ClassList,
    elButton: Button,
    elDialog: Dialog,
    elUpload: Upload
  },
  data() {
    return {
      listExcel: [],
      i18n: {
        grade: "年级",
        name: "班级名",
        majorName: "专业名"
      },
      title: "批量导入",
      isImport: true // 导入按钮点击状态
    };
  },
  computed: {
    ...mapState({
      showImportLog: state => state.showImportLog,
      token: state => state.userInfo.token
    })
  },
  methods: {
    ...mapMutations(["switchImportLog"]),
    closeImportLog() {
      this.switchImportLog();
    },
    templateDownload() {
      let listHead = new Object(),
        listHeadArr = new Array();
      Object.keys(this.i18n).forEach(v => {
        listHead[this.i18n[v]] = "";
      });
      listHeadArr.push(listHead);
      downloadExl(listHeadArr, "xlsx", "班级列表模板");
    },
    readExcel(file) {
      const xls = "application/vnd.ms-excel",
        xlsx =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (file.raw.type !== xls && file.raw.type !== xlsx) {
        Message.error("请选择Excel格式的文件！");
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          let sheetArray;
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          for (let sheet in workbook.Sheets) {
            changeExlHaed(workbook.Sheets[sheet], Object.keys(this.i18n));
            sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
          }
          sheetArray.forEach(item => {
            this.isImport = false;
            item.message = "";
            if (!item.grade) {
              item.message = "年级不能为空！";
              this.isImport = true;
            }
            if (!item.name) {
              item.message += "班级名不能为空！";
              this.isImport = true;
            }
            if (!item.majorName) {
              item.message += "专业名不能为空！";
              this.isImport = true;
            }
            this.listExcel.push(item);
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
    async importExcel() {
      let loading = Loading.service({
        text: "导入中，请稍候···"
      });
      const { data: res } = await this.$http.importClassList({
        classList: this.listExcel,
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        Message.success(res.msg);
        this.$emit("listChange");
        this.closeImportLog();
      } else {
        Message.error(res.msg);
      }
    }
  }
};
</script>
