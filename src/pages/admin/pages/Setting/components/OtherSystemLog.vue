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
import { mapActions, mapState } from "vuex";

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
    ...mapState({
      token: state => state.userInfo.token
    }),
    disabled() {
      return !(this.system.name && this.system.website);
    }
  },
  methods: {
    ...mapActions(["getItems"]),
    closeLog() {
      this.$emit("closeLog");
    },
    addSystem() {
      this.getItems({
        url: this.$store.state.addSystemItem,
        query: {
          system: this.system,
          token: this.token
        },
        cb: res => {
          if (res.code === 200) {
            Message.success(res.msg);
            this.$emit("settingChange");
            this.$emit("closeLog");
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
