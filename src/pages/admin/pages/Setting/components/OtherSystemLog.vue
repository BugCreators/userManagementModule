<template>
  <el-dialog :before-close="closeLog" :title="title" :visible.sync="showLog">
    <el-form class="system" :model="system" :rules="rules">
      <el-form-item :label="i18n.name" prop="name">
        <el-input v-model="system.name"></el-input>
      </el-form-item>
      <el-form-item :label="i18n.website" prop="website">
        <el-input v-model="system.website"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer" slot="footer">
      <el-button @click="closeLog">取消</el-button>
      <el-button type="primary" @click="addSystem" :disabled="disabled"
        >添加</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { Button, Dialog, Form, FormItem, Input, Message } from "element-ui";

export default {
  name: "otherSystemLog",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input
  },
  props: {
    showLog: Boolean
  },
  data() {
    return {
      title: `添加系统`,
      system: {
        name: "",
        website: ""
      },
      i18n: {
        name: `系统名`,
        website: `系统链接`
      },
      rules: {
        name: [{ required: true, message: `请输入系统名` }],
        website: [{ required: true, message: `请输入系统链接` }]
      }
    };
  },
  computed: {
    disabled() {
      if (this.system.name && this.system.website) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    closeLog() {
      this.$emit("closeLog");
    },
    addSystem() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.addSystemItem,
        query: {
          system: this.system,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            Message.success(res.msg);
            that.$emit("settingChange");
            that.$emit("closeLog");
          } else {
            Message.error(res.msg);
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scope>
.system {
  .el-input {
    width: 70%;
  }
  .el-form-item__label {
    width: 6em;
  }
}
</style>
