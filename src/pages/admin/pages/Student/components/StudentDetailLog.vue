<template>
  <el-dialog
    :before-close="closeDetailLog"
    :title="logTitle"
    :visible.sync="showDetailLog"
  >
    <el-form
      id="form"
      label-position="right"
      label-width="80px"
      ref="info"
      :model="info"
      :rules="rules"
    >
      <el-form-item :label="i18n['name']" prop="name">
        <el-input
          v-model="info.name"
          name="name"
          :placeholder="'请输入' + i18n['name']"
        >
          <i class="errorMsg" slot="suffix">
            {{ errorMsg }}
          </i>
        </el-input>
      </el-form-item>
      <el-form-item :label="i18n['level']" prop="level">
        <el-input
          v-model="info.level"
          name="level"
          :placeholder="'请输入' + i18n['level']"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['collegeName']" prop="college_id">
        <el-select
          v-model="info.college_id"
          :placeholder="'请选择' + i18n['collegeName']"
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
        <i class="errorMsg">
          {{ errorMsg2 }}
        </i>
      </el-form-item>
      <el-form-item :label="i18n['departmentName']" prop="department_id">
        <el-select v-model="info.department_id" placeholder="暂无院系">
          <el-option
            v-for="item in departmentList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="i18n['description']" prop="description">
        <el-input
          type="textarea"
          v-model="info.description"
          name="description"
          :autosize="{ minRows: 3, maxRows: 5 }"
          :placeholder="'请输入' + i18n['description']"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['train_objective']" prop="train_objective">
        <el-input
          type="textarea"
          v-model="info.train_objective"
          name="train_objective"
          :autosize="{ minRows: 3, maxRows: 5 }"
          :placeholder="'请输入' + i18n['train_objective']"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['main_course']" prop="main_course">
        <el-input
          type="textarea"
          v-model="info.main_course"
          name="main_course"
          :autosize="{ minRows: 3, maxRows: 5 }"
          :placeholder="'请输入' + i18n['main_course']"
        ></el-input>
      </el-form-item>
      <el-form-item
        :label="i18n['employment_direction']"
        prop="employment_direction"
      >
        <el-input
          type="textarea"
          v-model="info.employment_direction"
          name="employment_direction"
          :autosize="{ minRows: 3, maxRows: 5 }"
          :placeholder="'请输入' + i18n['employment_direction']"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDetailLog">取 消</el-button>
      <el-button type="primary" @click="formSubmit()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  Button,
  Dialog,
  Form,
  FormItem,
  Input,
  Loading,
  Message,
  Option,
  Select
} from "element-ui";

export default {
  name: "studentDetailLog",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input,
    elOption: Option,
    elSelect: Select
  },
  props: {
    dataId: Number
  },
  data() {
    return {
      info: {
        realname: "",
        number: "",
        college_id: "",
        class_id: "",
        sex: "",
        phone: "",
        address: "",
        email: "",
        description: ""
      },
      errorMsg: "",
      errorMsg2: "",
      i18n: {
        realname: "姓名",
        number: "学号",
        className: "班级",
        collegeName: "学院",
        sex: "性别",
        phone: "电话",
        address: "地址",
        email: "邮箱",
        description: "个人描述"
      },
      loading: true,
      rules: {
        name: [{ required: true, message: "请输入专业名称" }],
        level: [
          { required: true, min: 2, max: 4, message: "长度在 2 到 4 个字符" }
        ],
        college_id: [{ required: true, message: "请选择学院" }]
      },
      departmentList: {},
      collegeList: {}
    };
  },
  mounted() {
    this.getCollegeList();
    if (this.dataId) {
      this.getInfo();
    }
  },
  computed: {
    logTitle() {
      let title = this.dataId ? "编辑" : "添加";
      return title + "专业";
    },
    showDetailLog() {
      return this.$store.state.showDetailLog;
    }
  },
  methods: {
    getInfo() {
      let that = this;
      let loading = Loading.service();
      this.$store.dispatch("getItems", {
        url: this.$store.state.getStudentDetail,
        query: {
          id: this.dataId,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.info = res.data;
            that.getDepartmentList();
          } else {
            Message.error(res.msg);
            that.closeDetailLog();
          }
        }
      });
    },
    getCollegeList() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.getCollegeList,
        cb(res) {
          if (res.code === 200) {
            that.collegeList = res.data;
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    getDepartmentList(isChange) {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.getDepartmentListByCollegeId,
        query: {
          id: this.info.college_id,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            if (res.data.length > 0) {
              that.departmentList = res.data;
              isChange
                ? (that.info.department_id = that.departmentList[0].id)
                : "";
            } else {
              that.departmentList = {};
              that.info.department_id = "";
            }
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    collegeChange() {
      this.getDepartmentList(true);
    },
    formSubmit() {
      let url,
        that = this;
      if (this.dataId) {
        url = this.$store.state.changeStudent;
      } else {
        url = this.$store.state.addStudent;
      }
      if (this.info.name === "") {
        this.errorMsg = "专业名不能为空！";
        return;
      }
      this.errorMsg = "";
      if (this.info.college_id === "") {
        this.errorMsg2 = "学院不能为空！";
        return;
      }
      this.errorMsg2 = "";

      let loading = Loading.service({
        target: document.getElementById("form")
      });
      this.$store.dispatch("postItems", {
        url,
        query: {
          data: this.info,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            Message.success(res.msg);
            this.dataId
              ? that.$emit("dataChange", res.data)
              : that.$emit("listChange");
            that.closeDetailLog();
          } else {
            Message.error(res.msg || "添加失败，请稍后重试");
          }
        }
      });
    },
    closeDetailLog() {
      this.$store.commit("switchDetailLog");
    }
  }
};
</script>
