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
      <el-form-item :label="i18n['branchName']" prop="branch_id">
        <el-select
          v-model="info.branch_id"
          :placeholder="'请选择' + i18n['branchName']"
        >
          <el-option
            v-for="item in branchList"
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
      <el-form-item :label="i18n['level']" prop="level">
        <el-input
          v-model.number="info.level"
          name="level"
          placeholder="请输入0~127的整数，数字越小权限等级越大"
        >
          <i class="errorMsg" slot="suffix">
            {{ errorMsg2 }}
          </i>
        </el-input>
      </el-form-item>
      <el-form-item :label="i18n['authority']">
        <div v-if="info.module.length">
          <el-card
            v-for="item in info.module"
            :key="item.index"
            class="box-card"
          >
            <div slot="header" class="clearfix">
              <span>{{ item.cn_name }}</span>
            </div>
            <el-checkbox-group v-model="item.ids">
              <el-checkbox
                v-for="authority in item.authorityField"
                v-model="authority.permission"
                :label="authority.id"
                :key="authority.index"
                >{{ authority.cn_name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-card>
        </div>
        <div v-else>
          <el-card
            v-for="item in moduleList"
            :key="item.index"
            class="box-card"
          >
            <div slot="header" class="clearfix">
              <span>{{ item.cn_name }}</span>
            </div>
            <el-checkbox-group v-model="item.ids">
              <el-checkbox
                v-for="authority in item.authorityField"
                v-model="authority.permission"
                :label="authority.id"
                :key="authority.index"
                >{{ authority.cn_name }}</el-checkbox
              >
            </el-checkbox-group>
          </el-card>
        </div>
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
  Card,
  Checkbox,
  CheckboxGroup,
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
  name: "roleDetailLog",
  components: {
    elButton: Button,
    elCard: Card,
    elCheckbox: Checkbox,
    elCheckboxGroup: CheckboxGroup,
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
        branch_id: 0,
        description: "",
        level: "",
        module: []
      },
      moduleList: [],
      errorMsg: "",
      errorMsg2: "",
      i18n: {
        name: "角色名",
        branchName: "部门",
        description: "角色介绍",
        level: "权限等级",
        authority: "权限分配"
      },
      loadingOpts: {
        target: "",
        fullscreen: false
      },
      rules: {
        name: [{ required: true, message: "请输入角色名" }],
        level: [
          { required: true, message: "请输入权限等级" },
          { type: "number", min: 0, max: 127, message: "请输入0~127的整数" }
        ]
      },
      branchList: [
        {
          id: 0,
          name: "无"
        }
      ],
      checkedActions: [],
      checkAll: false,
      isIndeterminate: true
    };
  },
  computed: {
    ...mapState({
      showDetailLog: state => state.showDetailLog,
      token: state => state.userInfo.token
    }),
    logTitle() {
      return `${this.dataId ? "编辑" : "添加"}角色`;
    }
  },
  mounted() {
    this.loadingOpts.target = document.getElementById("form");
    this.getBranchList();
    if (this.dataId) {
      this.getInfo();
    } else {
      this.getModuleList();
    }
  },
  methods: {
    ...mapMutations(["switchDetailLog"]),
    async getInfo() {
      let loading = Loading.service();
      const { data: res } = await this.$http.getRoleDetail({
        id: this.dataId,
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        this.info = res.data;
      } else {
        Message.error(res.msg);
        this.switchDetailLog();
      }
    },
    async getBranchList() {
      let loading = Loading.service(this.loadingOpts);
      const { data: res } = await this.$http.getBranchListByRoleDetail({
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        this.branchList = this.branchList.concat(res.data);
      } else {
        Message.error(res.msg);
      }
    },
    async getModuleList() {
      let loading = Loading.service({
        target: document.getElementById("form")
      });
      const { data: res } = await this.$http.getModuleList({
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        this.moduleList = res.data;
      } else {
        Message.error(res.msg);
      }
    },
    async formSubmit() {
      let data = {};
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
      if (this.dataId) {
        data = await this.$http.changeRole({
          data: this.info,
          moduleList: this.moduleList,
          token: this.token
        });
      } else {
        data = await this.$http.addRole({
          data: this.info,
          moduleList: this.moduleList,
          token: this.token
        });
      }
      let res = data.data;
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
