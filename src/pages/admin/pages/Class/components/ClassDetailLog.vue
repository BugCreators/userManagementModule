<template>
  <el-dialog
    :before-close="switchDetailLog"
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
      <el-form-item :label="i18n['grade']" prop="grade">
        <el-select v-model="info.grade" :placeholder="'请选择' + i18n['grade']">
          <el-option
            v-for="(value, index) in gradeList"
            :key="index"
            :label="value"
            :value="value"
          ></el-option>
        </el-select>
        <i class="errorMsg">{{ errorMsg4 }}</i>
      </el-form-item>
      <el-form-item :label="i18n['name']" prop="name">
        <el-input
          v-model="info.name"
          name="name"
          :placeholder="'请输入' + i18n['name']"
        >
          <i class="errorMsg" slot="suffix">{{ errorMsg }}</i>
        </el-input>
      </el-form-item>
      <el-form-item :label="i18n['collegeName']" prop="college_id">
        <el-select
          v-model="info.college_id"
          @change="collegeChange"
          :placeholder="'请选择' + i18n['collegeName']"
        >
          <el-option
            v-for="item in collegeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <i class="errorMsg">{{ errorMsg2 }}</i>
      </el-form-item>
      <el-form-item :label="i18n['majorName']" prop="major_id">
        <el-select
          v-model="info.major_id"
          :placeholder="'请选择' + i18n['majorName']"
        >
          <el-option
            v-for="item in majorList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <i class="errorMsg">{{ errorMsg3 }}</i>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="switchDetailLog">取 消</el-button>
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
import { mapState, mapMutations } from "vuex";

export default {
  name: "classDetailLog",
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
        grade: "",
        name: "",
        major_id: "",
        college_id: ""
      },
      errorMsg: "",
      errorMsg2: "",
      errorMsg3: "",
      errorMsg4: "",
      i18n: {
        grade: "年级",
        name: "班级名",
        majorName: "专业",
        collegeName: "学院"
      },
      loading: true,
      rules: {
        grade: [{ required: true, message: "请选择年级" }],
        name: [{ required: true, message: "请输入专业名称" }],
        college_id: [{ required: true, message: "请选择学院" }],
        major_id: [{ required: true, message: "请选择专业" }]
      },
      gradeList: {},
      collegeList: {},
      majorList: {}
    };
  },
  computed: {
    ...mapState({
      showDetailLog: state => state.showDetailLog,
      token: state => state.userInfo.token
    }),
    logTitle() {
      return `${this.dataId ? "编辑" : "添加"}班级`;
    }
  },
  mounted() {
    this.getGradeList();
    this.getCollegeList();
    if (this.dataId) {
      this.getInfo();
    }
  },
  methods: {
    ...mapMutations(["switchDetailLog"]),
    async getInfo() {
      const loading = Loading.service();
      const res = await this.$http.getClassDetail({
        id: this.dataId,
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        this.info = res.data;
        this.getMajorList();
      } else {
        Message.error(res.msg);
        this.switchDetailLog();
      }
    },
    async getGradeList() {
      const res = await this.$http.getGradeList();
      if (res.code === 200) {
        this.gradeList = res.data;
      } else {
        Message.error(res.msg);
      }
    },
    async getCollegeList() {
      const res = await this.$http.getCollegeList();
      if (res.code === 200) {
        this.collegeList = res.data;
      } else {
        Message.error(res.msg);
      }
    },
    async getMajorList(isChange) {
      const res = await this.$http.getMajorListBycollegeId({
        id: this.info.college_id,
        token: this.token
      });
      if (res.code === 200) {
        if (res.data.length > 0) {
          this.majorList = res.data;
          isChange ? (this.info.major_id = this.majorList[0].id) : "";
        } else {
          this.majorList = {};
          this.info.major_id = "";
        }
      } else {
        Message.error(res.msg);
      }
    },
    collegeChange() {
      this.getMajorList(true);
    },
    async formSubmit() {
      let data = {};

      if (this.info.grade === "") {
        this.errorMsg4 = "年级不能为空！";
        return;
      }
      this.errorMsg4 = "";
      if (this.info.name === "") {
        this.errorMsg = "班级名不能为空！";
        return;
      }
      this.errorMsg = "";
      if (this.info.college_id === "") {
        this.errorMsg2 = "学院不能为空！";
        return;
      }
      this.errorMsg2 = "";
      if (this.info.major_id === "") {
        this.errorMsg3 = "专业不能为空！";
        return;
      }
      this.errorMsg3 = "";

      const loading = Loading.service({
        target: document.getElementById("form")
      });
      if (this.dataId) {
        data = await this.$http.changeClass({
          data: this.info,
          token: this.token
        });
      } else {
        data = await this.$http.addClass({
          data: this.info,
          token: this.token
        });
      }
      const res = data;
      loading.close();
      if (res.code === 200) {
        Message.success(res.msg);
        this.$emit("listChange");
        this.switchDetailLog();
      } else {
        Message.error(res.msg || "添加失败，请稍后重试");
      }
    }
  }
};
</script>
