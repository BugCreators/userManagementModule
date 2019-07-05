<template>
  <el-dialog
    :before-close="closeExportLog"
    :title="title"
    :visible.sync="showExportLog"
  >
    <el-form>
      <el-form-item :label="i18n['college']" prop="college_id">
        <el-select
          v-model="info.college_id"
          :placeholder="'请选择' + i18n['college']"
          @change="collegeChange"
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
          v-model="info.major_id"
          placeholder="暂无专业"
          @change="majorChange"
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
        <el-select v-model="info.class_id" placeholder="暂无班级">
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
    <div class="logWarp">
      <el-button type="primary" @click="listExportConfirm">导出</el-button>
      <el-button @click="closeExportLog">取消</el-button>
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
  Option
} from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import { downloadExl } from "@/assets/js/tool";
import { mapState } from "vuex";

export default {
  name: "studentListExport",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elSelect: Select,
    elOption: Option
  },
  props: {
    showExportLog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: "导出学生数据",
      info: {
        college_id: "",
        major_id: "",
        class_id: ""
      },
      i18n: {
        college: "学院",
        major: "专业",
        class: "班级",
        sex: "性别"
      },
      collegeList: [],
      majorList: [],
      classList: [],
      defaultOption: [
        {
          grade: "",
          id: -1,
          name: "不选择"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      token: state => state.userInfo.token
    })
  },
  created() {
    this.getCollegeList();
  },
  methods: {
    closeExportLog() {
      this.$emit("switchExportLog");
    },
    async getCollegeList() {
      const { data: res } = await this.$http.getCollegeList();
      if (res.code === 200) {
        this.collegeList = this.defaultOption.concat(res.data);
      } else {
        Message.error(res.msg);
      }
    },
    async getMajorList() {
      const { data: res } = await this.$http.getMajorListBycollegeId({
        id: this.info.college_id,
        token: this.token
      });
      if (res.code === 200) {
        if (res.data.length > 0) {
          this.majorList = this.defaultOption.concat(res.data);
          this.info.major_id = this.majorList[0].id;
        } else {
          this.majorList = {};
          this.info.major_id = "";
        }
      } else {
        Message.error(res.msg);
      }
    },
    async getClassList() {
      const { data: res } = await this.$http.getClassListByMajorId({
        id: this.info.major_id,
        token: this.token
      });
      if (res.code === 200) {
        if (res.data.length > 0) {
          this.classList = this.defaultOption.concat(res.data);
          this.info.class_id = this.classList[0].id;
        } else {
          this.classList = {};
          this.info.class_id = "";
        }
      } else {
        Message.error(res.msg);
      }
    },
    collegeChange() {
      if (this.info.college_id != -1) {
        this.getMajorList();
      }
    },
    majorChange() {
      if (this.info.major_id != -1) {
        this.getClassList(true);
      }
    },
    listExportConfirm() {
      avueMsgBox({
        message: "确认导出当前列表数据？"
      })
        .then(() => this.listExport())
        .catch(() => Message.info("取消导出"));
    },
    async listExport() {
      let allList;
      const loading = Loading.service({
        text: "获取数据导出中，请稍候..."
      });
      const { data: res } = await this.$http.getAllStudentList({
        data: this.info,
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        if (res.data.length) {
          const listTemp = res.data;
          allList = listTemp.map(item => {
            item[this.i18n["sex"]] = item[this.i18n["sex"]] ? "男" : "女";
            return item;
          });
          downloadExl(allList, "xlsx", "学生列表");
        } else {
          Message.info("暂无学生信息");
        }
      } else {
        Message.error(res.msg);
      }
    }
  }
};
</script>
