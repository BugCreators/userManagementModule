<template>
  <el-dialog
    :before-close="switchImportLog"
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
    <BranchList v-if="listExcel" :listExcel="listExcel" :isImport="true" />
    <div class="logWarp">
      <el-button type="primary" @click="importExcel" :disabled="isImport"
        >导入</el-button
      >
      <el-button @click="switchImportLog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Button, Dialog, Loading, Message, Upload } from "element-ui";
import BranchList from "./BranchList";
import { read, utils, downloadExl, changeExlHaed } from "@/assets/js/tool";
import { mapState, mapMutations } from "vuex";

export default {
  name: "branchListImport",
  components: {
    BranchList,
    elButton: Button,
    elDialog: Dialog,
    elUpload: Upload
  },
  data() {
    return {
      listExcel: [],
      i18n: {
        name: "部门名",
        website: "官网链接",
        level: "等级",
        operating_duty: "主要职能",
        description: "概述"
      },
      level: {
        校级: 0,
        院级: 1
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
    templateDownload() {
      let listHead = new Object(),
        listHeadArr = new Array();
      Object.keys(this.i18n).forEach(v => {
        listHead[this.i18n[v]] = "";
      });
      listHeadArr.push(listHead);
      downloadExl(listHeadArr, "xlsx", "部门列表模板");
    },
    readExcel({ raw }) {
      const xls = "application/vnd.ms-excel",
        xlsx =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (raw.type !== xls && raw.type !== xlsx) {
        Message.error("请选择Excel格式的文件！");
        return false;
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          let sheetArray;
          const data = ev.target.result;
          const workbook = read(data, {
            type: "binary"
          });
          for (let sheet in workbook.Sheets) {
            changeExlHaed(workbook.Sheets[sheet], Object.keys(this.i18n));
            sheetArray = utils.sheet_to_json(workbook.Sheets[sheet]);
          }
          sheetArray.forEach(item => {
            this.isImport = false;
            if (!item.name) {
              item.message = "部门名不能为空！";
              this.isImport = true;
            }
            if (!item.level) {
              item.message = "等级不能为空！";
              this.isImport = true;
            }
            if (item.level != "院级" && item.level != "校级") {
              item.message = "等级错误！例：校级";
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
      fileReader.readAsBinaryString(raw);
    },
    removeExcel() {
      this.listExcel = [];
      this.isImport = true;
    },
    async importExcel() {
      const loading = Loading.service({
        text: "导入中，请稍候···"
      });
      const listCopy = JSON.parse(JSON.stringify(this.listExcel));
      const newList = listCopy.map(item => {
        const level = item.level;
        item.level = this.level[level];
        return item;
      });
      const res = await this.$http.importBranchList({
        branchList: newList,
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        Message.success(res.msg);
        this.$emit("listChange");
        this.switchImportLog();
      } else {
        Message.error(res.msg);
      }
    }
  }
};
</script>
