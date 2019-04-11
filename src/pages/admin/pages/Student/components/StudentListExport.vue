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
  MessageBox,
  Select,
  Option
} from "element-ui";
import { downloadExl } from "@/assets/js/tool";

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
  created() {
    this.getCollegeList();
  },
  methods: {
    closeExportLog() {
      this.$emit("switchExportLog");
    },
    getCollegeList() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.getCollegeList,
        cb(res) {
          if (res.code === 200) {
            that.collegeList = that.defaultOption.concat(res.data);
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    getMajorList() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.getMajorListBycollegeId,
        query: {
          id: this.info.college_id,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            if (res.data.length > 0) {
              that.majorList = that.defaultOption.concat(res.data);
              that.info.major_id = that.majorList[0].id;
            } else {
              that.majorList = {};
              that.info.major_id = "";
            }
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    getClassList() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.getClassListByMajorId,
        query: {
          id: this.info.major_id,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            if (res.data.length > 0) {
              that.classList = that.defaultOption.concat(res.data);
              that.info.class_id = that.classList[0].id;
            } else {
              that.classList = {};
              that.info.class_id = "";
            }
          } else {
            Message.error(res.msg);
          }
        }
      });
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
      let that = this;
      MessageBox.confirm("确认导出当前列表数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback(action) {
          switch (action) {
            case "cancel":
            case "close":
              Message.info("取消导出");
              break;
            case "confirm":
              that.listExport();
              break;
          }
        }
      });
    },
    listExport() {
      let allList,
        that = this;
      let loading = Loading.service({
        text: "获取数据导出中，请稍候..."
      });
      return this.$store.dispatch("postItems", {
        url: that.$store.state.getAllStudentList,
        query: {
          data: that.info,
          token: that.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            if (res.data.length) {
              let listTemp = res.data;
              allList = listTemp.map(item => {
                if (item[that.i18n["sex"]] == 1) {
                  item[that.i18n["sex"]] = "男";
                } else {
                  item[that.i18n["sex"]] = "女";
                }
                return item;
              });
              downloadExl(allList, "xlsx", "学生列表");
            } else {
              Message.info("暂无学生信息");
            }
          } else {
            Message.error(res.msg);
          }
          loading.close();
        }
      });
    }
  }
};
</script>
