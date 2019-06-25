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
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "majorDetailLog",
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
        name: "",
        level: "",
        college_id: "",
        department_id: "",
        description: "",
        train_objective: "",
        main_course: "",
        employment_direction: ""
      },
      errorMsg: "",
      errorMsg2: "",
      i18n: {
        name: "专业名",
        level: "学历层次",
        departmentName: "教学系",
        collegeName: "学院",
        description: "专业概况",
        train_objective: "培养目标",
        main_course: "主要课程",
        employment_direction: "就业方向"
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
  computed: {
    ...mapState({
      showDetailLog: state => state.showDetailLog,
      token: state => state.userInfo.token
    }),
    logTitle() {
      return `${this.dataId ? "编辑" : "添加"}专业`;
    }
  },
  mounted() {
    this.getCollegeList();
    if (this.dataId) {
      this.getInfo();
    }
  },
  methods: {
    ...mapActions(["getItems", "postItems"]),
    ...mapMutations(["switchDetailLog"]),
    getInfo() {
      let loading = Loading.service();
      this.getItems({
        url: this.$store.state.getMajorDetail,
        query: {
          id: this.dataId,
          token: this.token
        },
        cb: res => {
          loading.close();
          if (res.code === 200) {
            this.info = res.data;
            this.getDepartmentList();
          } else {
            Message.error(res.msg);
            this.switchDetailLog();
          }
        }
      });
    },
    getCollegeList() {
      this.getItems({
        url: this.$store.state.getCollegeList,
        cb: res => {
          if (res.code === 200) {
            this.collegeList = res.data;
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    getDepartmentList(isChange) {
      this.getItems({
        url: this.$store.state.getDepartmentListByCollegeId,
        query: {
          id: this.info.college_id,
          token: this.token
        },
        cb: res => {
          if (res.code === 200) {
            if (res.data.length > 0) {
              this.departmentList = res.data;
              isChange
                ? (this.info.department_id = this.departmentList[0].id)
                : "";
            } else {
              this.departmentList = {};
              this.info.department_id = "";
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
      let url = "";
      if (this.dataId) {
        url = this.$store.state.changeMajor;
      } else {
        url = this.$store.state.addMajor;
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
      this.postItems({
        url,
        query: {
          data: this.info,
          token: this.token
        },
        cb: res => {
          loading.close();
          if (res.code === 200) {
            Message.success(res.msg);
            this.$emit("listChange");
            this.switchDetailLog();
          } else {
            Message.error(res.msg || "添加失败，请稍后重试");
          }
        }
      });
    }
  }
};
</script>
