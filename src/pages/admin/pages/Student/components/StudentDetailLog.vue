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
      <el-form-item :label="i18n['realname']" prop="realname">
        <el-input
          v-model="info.realname"
          name="realname"
          :placeholder="'请输入' + i18n['realname']"
        >
          <i class="errorMsg" slot="suffix">
            {{ errorMsg }}
          </i>
        </el-input>
      </el-form-item>
      <el-form-item :label="i18n['number']" prop="number">
        <el-input
          v-model.number="info.number"
          name="number"
          placeholder="请输入11位学号"
        >
          <i class="errorMsg" slot="suffix">
            {{ errorMsg3 }}
          </i>
        </el-input>
      </el-form-item>
      <el-form-item :label="i18n['sex']">
        <el-radio-group v-model="info.sex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
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
        <i class="errorMsg">
          {{ errorMsg2 }}
        </i>
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
      <el-form-item :label="i18n['phone']" prop="phone">
        <el-input
          v-model="info.phone"
          name="phone"
          :placeholder="'请输入' + i18n['phone']"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['address']" prop="address">
        <el-input
          v-model="info.address"
          name="address"
          :placeholder="'请输入' + i18n['address']"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['email']" prop="email">
        <el-input
          v-model="info.email"
          name="email"
          :placeholder="'请输入' + i18n['email']"
        ></el-input>
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
  Select,
  Radio,
  RadioGroup
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
    elSelect: Select,
    elRadio: Radio,
    elRadioGroup: RadioGroup
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
        major_id: "",
        class_id: "",
        sex: 1,
        phone: "",
        address: "",
        email: "",
        description: ""
      },
      errorMsg: "",
      errorMsg2: "",
      errorMsg3: "",
      i18n: {
        realname: "姓名",
        number: "学号",
        class: "班级",
        major: "专业",
        college: "学院",
        sex: "性别",
        phone: "电话",
        address: "地址",
        email: "邮箱",
        description: "个人描述"
      },
      loading: true,
      rules: {
        realname: [{ required: true, message: "请输入姓名" }],
        number: [
          { required: true, message: "学号不能为空" },
          {
            type: "number",
            min: 10000000000,
            max: 99999999999,
            message: "请输入11位的数字"
          }
        ],
        college_id: [{ required: true, message: "请选择学院" }],
        major_id: [{ required: true, message: "请选择专业" }],
        class_id: [{ required: true, message: "请选择班级" }]
      },
      collegeList: {},
      majorList: {},
      classList: {}
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
      return title + "学生";
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
            that.info.number = Number(that.info.number);
            that.getMajorList();
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
    getMajorList(isChange) {
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
              that.majorList = res.data;
              isChange ? (that.info.major_id = that.majorList[0].id) : "";
            } else {
              that.majorList = {};
              that.info.major_id = "";
            }
            that.getClassList();
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    getClassList(isChange) {
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
              that.classList = res.data;
              isChange ? (that.info.class_id = that.classList[0].id) : "";
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
      this.getMajorList(true);
    },
    majorChange() {
      this.getClassList(true);
    },
    formSubmit() {
      let url,
        that = this;
      if (this.dataId) {
        url = this.$store.state.changeStudent;
      } else {
        url = this.$store.state.addStudent;
      }
      if (this.info.realname === "") {
        this.errorMsg = "姓名不能为空！";
        return;
      }
      this.errorMsg = "";
      if (this.info.number.toString().length < 11) {
        this.errorMsg3 = "请输入11位的学号！";
        return;
      }
      this.errorMsg3 = "";
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
            that.$emit("listChange");
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
