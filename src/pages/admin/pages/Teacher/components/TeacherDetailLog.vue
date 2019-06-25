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
          placeholder="请输入11位职工号"
        >
          <i class="errorMsg" slot="suffix">
            {{ errorMsg3 }}
          </i>
        </el-input>
      </el-form-item>
      <el-form-item :label="i18n['college']" prop="college_id">
        <el-select
          v-model="info.college_id"
          :placeholder="'请选择' + i18n['college']"
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
      <el-form-item :label="i18n['sex']">
        <el-radio-group v-model="info.sex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
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
  Select,
  Radio,
  RadioGroup
} from "element-ui";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "teacherDetailLog",
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
        number: "职工号",
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
          { required: true, message: "职工号不能为空" },
          {
            type: "number",
            min: 10000000000,
            max: 99999999999,
            message: "请输入11位的数字"
          }
        ],
        college_id: [{ required: true, message: "请选择学院" }]
      },
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
    ...mapState({
      showDetailLog: state => state.showDetailLog,
      token: state => state.userInfo.token
    }),
    logTitle() {
      return `${this.dataId ? "编辑" : "添加"}教师`;
    }
  },
  methods: {
    ...mapActions(["getItems", "postItems"]),
    ...mapMutations(["switchDetailLog"]),
    getInfo() {
      let loading = Loading.service();
      this.getItems({
        url: this.$store.state.getTeacherDetail,
        query: {
          id: this.dataId,
          token: this.token
        },
        cb: res => {
          loading.close();
          if (res.code === 200) {
            this.info = res.data;
            this.info.number = Number(this.info.number);
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
    formSubmit() {
      let url;
      if (this.dataId) {
        url = this.$store.state.changeTeacher;
      } else {
        url = this.$store.state.addTeacher;
      }
      if (this.info.realname === "") {
        this.errorMsg = "姓名不能为空！";
        return;
      }
      this.errorMsg = "";
      if (this.info.number.toString().length < 11) {
        this.errorMsg3 = "请输入11位的职工号！";
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
