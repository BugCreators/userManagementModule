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
        <el-input v-model="info.name" name="name">
        </el-input>
      </el-form-item>
      <el-form-item :label="i18n['description']" prop="description">
        <el-input
          type="textarea"
          v-model="info.description"
          name="description"
          :autosize="{ minRows: 3, maxRows: 5 }"
        ></el-input>
      </el-form-item>
      <el-form-item :label="i18n['level']" prop="level">
        <el-input v-model.number="info.level" name="level">
        </el-input>
      </el-form-item>
      <el-form-item :label="i18n['authority']">
        <el-card v-for="item in info.module" :key="item.index" class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ item.cn_name }}</span>
          </div>
          <el-checkbox-group v-model="item.ids">
            <el-checkbox v-for="authority in item.authorityField" 
              v-model="authority.permission"
              :label="authority.id" 
              :key="authority.index">{{authority.cn_name}}</el-checkbox>
          </el-checkbox-group>
        </el-card>
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
  Card,
  Checkbox,
  CheckboxGroup,
  Dialog,
  Form,
  FormItem,
  Input,
  Loading,
  Message
} from "element-ui";

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
    elInput: Input
  },
  props: {
    dataId: Number
  },
  data() {
    return {
      info: {
        name: "",
        description: "",
        level: "",
        module: []
      },
      moduleList: [],
      i18n: {
        name: "角色名",
        description: "角色介绍",
        level: "权限等级",
        authority: "权限分配"
      },
      loading: true,
      rules: {
        name: [
          { required: true, message: "请输入专业名称"}
        ],
        level: [
          { required: true, message: "请输入权限等级"},
          { type: "number", min: 0, max: 127, message: "请输入0~127的整数"}
        ]
      },
      checkedActions: [],
      checkAll: false,
      isIndeterminate: true
    };
  },
  mounted() {
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
        url: this.$store.state.getRoleDetail,
        query: {
          id: this.dataId,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.info = res.data;

          } else {
            Message.error(res.msg);
            that.closeDetailLog();
          }
        }
      });
    },
    formSubmit() {
      let url,
        that = this;
      if (this.dataId) {
        url = this.$store.state.changeRole;
      } else {
        url = this.$store.state.addRole;
      }
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
