<template>
  <el-dialog :title="logTitle" :before-close="closelog" :visible.sync="showLog">
    <el-form :model="collegeDetail" label-position="left">
      <el-form-item label="学院名">
        <el-input v-model="collegeDetail.name" autocomplete="off"></el-input>
      </el-form-item>
      <!--         <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closelog">取 消</el-button>
      <el-button
        type="primary"
        @click="collegeId != 0 ? collegeEdit() : collegeAdd()"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { Button, Dialog, Form, FormItem, Input, Message } from "element-ui";

export default {
  name: "collegeEditLog",
  components: {
    elButton: Button,
    elDialog: Dialog,
    elForm: Form,
    elFormItem: FormItem,
    elInput: Input
  },
  props: {
    collegeId: Number,
    showEditLog: Boolean
  },
  data() {
    return {
      collegeDetail: {},
      showLog: this.showEditLog
    };
  },
  created() {
    if (this.collegeId != 0) {
      this.getCollegeDetail();
    }
  },
  computed: {
    logTitle() {
      let title = this.collegeId != 0 ? "编辑" : "添加";
      return title + "学院";
    }
  },
  methods: {
    getCollegeDetail() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: that.$store.state.getCollegeDetail,
        query: {
          id: that.collegeId
        },
        cb(res) {
          if (res.success) {
            that.collegeDetail = res.data;
          } else {
            Message.error({
              message: res.message || "获取信息失败，请稍后再试"
            });
            // that.closelog();
          }
        }
      });
    },
    collegeEdit() {
      Message.success({
        message: "修改成功!"
      });
      this.closelog();
    },
    collegeAdd() {
      Message.success({
        message: "添加成功!"
      });
      this.closelog();
    },
    closelog() {
      this.showLog = false;
      this.$emit("closelog");
    }
  }
};
</script>
