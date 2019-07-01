<template>
  <el-dialog
    :before-close="switchImportLog"
    :title="title"
    :visible.sync="showImportLog"
  >
    <el-form class="studentImport" :rule="rules">
      <el-form-item :label="i18n['college']" prop="college_id">
        <el-select
          v-model="data.college_id"
          placeholder="请选择学院"
          @change="getMajorList"
        >
          <el-option
            v-for="item in collegeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="i18n['major']" prop="major_id">
        <el-select
          v-model="data.major_id"
          placeholder="暂无专业"
          @change="getClassList"
        >
          <el-option
            v-for="item in majorList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="i18n['class']" prop="class_id">
        <el-select v-model="data.class_id" placeholder="暂无班级">
          <el-option
            v-for="item in classList"
            :key="item.id"
            :label="item.grade + item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <p class="errorMsg mgtb-10">{{ message }}</p>
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
    <StudentList v-if="listExcel" :listExcel="listExcel" :isImport="true" />
    <div class="logWarp">
      <el-button type="primary" @click="importExcel" :disabled="isImport"
        >导入</el-button
      >
      <el-button @click="switchImportLog">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  Button,
  Dialog,
  Form,
  FormItem,
  Loading,
  Message,
  Select,
  Option,
  Upload
} from "element-ui";
import StudentList from "./StudentList";
import { downloadExl, changeExlHaed, read, utils } from "@/assets/js/tool";
import { mapState, mapMutations } from "vuex";

export default {
  name: "studentListImport",
  components: {
    StudentList,
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elSelect: Select,
    elOption: Option,
    elUpload: Upload
  },
  data() {
    return {
      data: {
        college_id: "",
        major_id: "",
        class_id: ""
      },
      listExcel: [],
      i18n: {
        realname: "姓名",
        number: "学号",
        sex: "性别",
        phone: "电话",
        address: "地址",
        email: "邮箱",
        description: "个人描述"
      },
      collegeList: [],
      majorList: [],
      classList: [],
      message: "",
      title: "批量导入",
      isImport: true, // 导入按钮点击状态
      sex: {
        男: 1,
        女: 0
      },
      rules: {
        college_id: [{ require: true, message: "请选择学院" }],
        major_id: [{ required: true, message: "请选择专业" }],
        class_id: [{ required: true, message: "请选择班级" }]
      }
    };
  },
  computed: {
    ...mapState({
      showImportLog: state => state.showImportLog,
      token: state => state.userInfo.token
    })
  },
  created() {
    this.getCollegeList();
  },
  methods: {
    ...mapMutations(["switchImportLog"]),
    async getCollegeList() {
      const { data: res } = await this.$http.getCollegeList();
      if (res.code === 200) {
        this.collegeList = res.data;
      } else {
        Message.error(res.msg);
      }
    },
    async getMajorList() {
      const { data: res } = await this.$http.getMajorListBycollegeId({
        id: this.data.college_id,
        token: this.token
      });
      if (res.code === 200) {
        if (res.data.length > 0) {
          this.majorList = res.data;
          this.data.major_id = this.majorList[0].id;
        } else {
          this.majorList = {};
          this.data.major_id = "";
        }
        this.getClassList();
      } else {
        Message.error(res.msg);
      }
    },
    async getClassList() {
      const { data: res } = await this.$http.getClassListByMajorId({
        id: this.data.major_id,
        token: this.token
      });
      if (res.code === 200) {
        if (res.data.length > 0) {
          this.classList = res.data;
          this.data.class_id = this.classList[0].id;
        } else {
          this.classList = {};
          this.data.class_id = "";
        }
      } else {
        Message.error(res.msg);
      }
    },
    templateDownload() {
      let listHead = new Object(),
        listHeadArr = new Array();
      Object.keys(this.i18n).forEach(v => {
        listHead[this.i18n[v]] = "";
      });
      listHeadArr.push(listHead);
      downloadExl(listHeadArr, "xlsx", "学生列表模板");
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
          const workbook = read(data, {
            type: "binary"
          });
          for (let sheet in workbook.Sheets) {
            changeExlHaed(workbook.Sheets[sheet], Object.keys(this.i18n));
            sheetArray = utils.sheet_to_json(workbook.Sheets[sheet]);
          }
          sheetArray.forEach(item => {
            this.isImport = false;
            item.message = "";
            if (!item.realname) {
              item.message = "姓名不能为空！";
              this.isImport = true;
            }
            if (item.number.toString().length != 11) {
              item.message += "学号格式错误：11位数字";
              this.isImport = true;
            }
            if (item.sex) {
              if (item.sex != "男" && item.sex != "女") {
                item.message = "性别错误！例：男";
                this.isImport = true;
              }
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
      if (this.data.college_id == "") {
        this.message = "学院不能为空！";
        return;
      }
      if (this.data.major_id == "") {
        this.message = "专业不能为空！";
        return;
      }
      if (this.data.class_id == "") {
        this.message = "班级不能为空！";
        return;
      }
      let loading = Loading.service({
        text: "导入中，请稍候···"
      });
      let listCopy = JSON.parse(JSON.stringify(this.listExcel));
      let newList = listCopy.map(item => {
        let sex = item.sex;
        item.sex = this.sex[sex];
        item.role_id = 2;
        item.college_id = this.data.college_id;
        item.class_id = this.data.class_id;
        return item;
      });
      const { data: res } = await this.$http.importStudentList({
        data: this.data,
        studentList: newList,
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
