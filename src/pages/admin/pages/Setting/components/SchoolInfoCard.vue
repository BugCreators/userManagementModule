<template>
  <el-card class="schoolInfo">
    <div slot="header">
      <span>{{ initName }}</span>
      <div v-if="disabled" class="cardButton">
        <el-button type="text" @click="switchDisabled(false)">编辑</el-button>
      </div>
      <div class="cardButton" v-else>
        <el-button type="text" @click="changeSchoolInfo">确定</el-button>
        <el-button type="text" @click="switchDisabled(true)">取消</el-button>
      </div>
    </div>
    <div class="schoolInfoInput">
      <label class="el-form-item__label">学校名</label>
      <el-input v-model="schoolInfo.name" :disabled="disabled"></el-input>
      <label class="el-form-item__label">学校地址</label>
      <el-input v-model="schoolInfo.address" :disabled="disabled"></el-input>
    </div>
  </el-card>
</template>

<script>
import { Button, Card, Message } from "element-ui";
import { mapState, mapActions } from "vuex";

export default {
  name: "schoolInfoCard",
  components: {
    elButton: Button,
    elCard: Card
  },
  props: {
    schoolInfo: Object
  },
  data() {
    return {
      disabled: true,
      initName: "",
      initAddress: ""
    };
  },
  created() {
    this.initName = this.schoolInfo.name;
    this.initAddress = this.schoolInfo.address;
  },
  computed: {
    ...mapState({
      token: state => state.userInfo.token
    })
  },
  methods: {
    ...mapActions(["getItems"]),
    switchDisabled(isCancel) {
      if (isCancel) {
        this.schoolInfo.name = this.initName;
        this.schoolInfo.address = this.initAddress;
      }
      this.disabled = !this.disabled;
    },
    changeSchoolInfo() {
      if (
        this.initName === this.schoolInfo.name &&
        this.initAddress === this.schoolInfo.address
      ) {
        this.switchDisabled();
      } else {
        this.getItems({
          url: this.$store.state.changeSchoolInfo,
          query: {
            schoolInfo: {
              name: this.schoolInfo.name,
              address: this.schoolInfo.address
            },
            token: this.token
          },
          cb: res => {
            if (res.code === 200) {
              Message.success(res.msg);
              this.switchDisabled();
            } else {
              Message.error(res.msg);
            }
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scope>
.schoolInfo {
  &.el-card {
    max-width: none !important;
    width: auto !important;
  }
}
.schoolInfoInput {
  .el-input {
    margin-bottom: 20px;
  }
}
</style>
