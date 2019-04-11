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
          placeholder="请输入11位职工号"
        >
          <i class="errorMsg" slot="suffix">
            {{ errorMsg2 }}
          </i>
        </el-input>
      </el-form-item>
      <el-form-item :label="i18n['sex']">
        <el-radio-group v-model="info.sex">
          <el-radio :label="0">女</el-radio>
          <el-radio :label="1">男</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="i18n['branch']" prop="branch_id">
        <el-select
          v-model="info.branch_id"
          @change="branchChange"
          :placeholder="'请选择' + i18n['branch']"
        >
          <el-option
            v-for="item in branchList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <i class="errorMsg">
          {{ errorMsg3 }}
        </i>
      </el-form-item>
      <el-form-item :label="i18n['role']" prop="role_id">
        <el-select
          v-model="info.role_id"
          :placeholder="'请选择' + i18n['role']"
        >
          <el-option
            v-for="item in roleList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
        <i class="errorMsg">
          {{ errorMsg4 }}
        </i>
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
  Radio,
  RadioGroup,
  Select
} from "element-ui";

export default {
  name: "administratorDetailLog",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input,
    elOption: Option,
    elRadio: Radio,
    elRadioGroup: RadioGroup,
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
        branch_id: 0,
        role_id: "",
        sex: 1,
        phone: "",
        address: "",
        email: "",
        description: ""
      },
      branchList: [
        {
          id: 0,
          name: "无"
        }
      ],
      roleList: [],
      errorMsg: "", // 姓名错误信息
      errorMsg2: "", // 职工号错误信息
      errorMsg3: "", // 部门错误信息
      errorMsg4: "", // 角色错误信息
      i18n: {
        realname: "姓名",
        number: "职工号",
        branch: "部门",
        role: "角色",
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
        branch_id: [{ required: true, message: "请选择部门" }],
        role_id: [{ required: true, message: "请选择角色" }]
      },
      checkedActions: [],
      checkAll: false,
      isIndeterminate: true
    };
  },
  mounted() {
    this.getBranchList();
    if (this.dataId) {
      this.getInfo();
    }
  },
  computed: {
    logTitle() {
      let title = this.dataId ? "编辑" : "添加";
      return title + "角色";
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
        url: this.$store.state.getAdministratorDetail,
        query: {
          id: this.dataId,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.info = res.data;
            that.info.number = Number(that.info.number);
          } else {
            Message.error(res.msg);
            that.closeDetailLog();
          }
        }
      });
    },
    getBranchList() {
      let that = this;
      let loading = Loading.service({
        target: document.getElementById("form")
      });
      this.$store.dispatch("getItems", {
        url: this.$store.state.getBranchListByAdminDetail,
        query: {
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.branchList = that.branchList.concat(res.data);
            that.getRoleList();
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    getRoleList() {
      let that = this;
      let loading = Loading.service({
        target: document.getElementById("form")
      });
      this.$store.dispatch("getItems", {
        url: this.$store.state.getRoleListByBranchId,
        query: {
          branchId: this.info.branch_id,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.roleList = res.data;
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    branchChange() {
      this.getRoleList();
    },
    formSubmit() {
      let url,
        that = this;
      if (this.dataId) {
        url = this.$store.state.changeAdministrator;
      } else {
        url = this.$store.state.addAdministrator;
      }
      if (this.info.name === "") {
        this.errorMsg = "角色名不能为空！";
        return;
      }
      this.errorMsg = "";
      if (this.info.level === "") {
        this.errorMsg2 = "权限等级不能为空！";
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
          moduleList: this.moduleList,
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
