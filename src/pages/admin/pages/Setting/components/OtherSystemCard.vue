<template>
  <el-card>
    <div slot="header">
      <span>{{ initName }}</span>
      <div v-if="disabled" class="cardButton">
        <el-button type="text" @click="switchDisabled">编辑</el-button>
        <el-button type="text" @click="deleteItemConfirm">删除</el-button>
      </div>
      <div class="cardButton" v-else>
        <el-button type="text" @click="changeOtherSystem">确定</el-button>
        <el-button type="text" @click="switchDisabled(true)">取消</el-button>
      </div>
    </div>
    <div class="otherSystemInput">
      <label class="el-form-item__label">系统名</label>
      <el-input v-model="system.name" :disabled="disabled"></el-input>
      <label class="el-form-item__label">系统链接</label>
      <el-input v-model="system.website" :disabled="disabled"></el-input>
    </div>
  </el-card>
</template>

<script>
import { Button, Card, Message, MessageBox } from "element-ui";

export default {
  name: "otherSystemCard",
  components: {
    elButton: Button,
    elCard: Card
  },
  props: {
    system: Object
  },
  data() {
    return {
      disabled: true,
      initName: "",
      initWebsite: ""
    };
  },
  created() {
    this.initName = this.system.name;
    this.initWebsite = this.system.website;
  },
  methods: {
    switchDisabled(isCancel) {
      if (isCancel) {
        this.system.name = this.initName;
        this.system.website = this.initWebsite;
      }
      this.disabled = !this.disabled;
    },
    changeOtherSystem() {
      if (
        this.initName === this.system.name &&
        this.initWebsite === this.system.website
      ) {
        this.switchDisabled();
      } else {
        let that = this;
        this.$store.dispatch("getItems", {
          url: this.$store.state.changeSystemItem,
          query: {
            system: this.system,
            token: this.$store.state.userInfo.token
          },
          cb(res) {
            if (res.code === 200) {
              Message.success(res.msg);
              that.switchDisabled();
            } else {
              Message.error(res.msg);
            }
          }
        });
      }
    },
    deleteItemConfirm() {
      let that = this;
      MessageBox.confirm(`确认删除该系统链接？`, `确认删除`, {
        type: "warning",
        callback(action) {
          switch (action) {
            case "cancel":
            case "close":
              Message.info(`取消删除`);
              break;
            case "confirm":
              that.deleteItem();
          }
        }
      });
    },
    deleteItem() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.deleteSystemItem,
        query: {
          index: this.system.index,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            Message.success(res.msg);
            that.$emit("settingChange");
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
.otherSystemInput {
  .el-form-item__label {
    width: 6em;
    &::before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
  }
  .el-input {
    margin-bottom: 20px;
    width: 75% !important;
  }
}
</style>
