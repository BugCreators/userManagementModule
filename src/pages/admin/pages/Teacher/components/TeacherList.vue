<template>
  <div class="teacherList">
    <el-table
      id="list"
      :row-style="rowStyle"
      :data="list"
      @selection-change="selectedChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column
        v-if="!isImport"
        prop="collegeName"
        label="学院"
      ></el-table-column
      ><el-table-column
        v-for="(value, key, index) in i18n"
        :prop="key"
        :key="index"
        :label="value"
      ></el-table-column>
      <el-table-column
        v-if="isImport"
        fixed="right"
        label="消息"
        prop="message"
        width="100"
        :class-name="'errorMsg'"
      ></el-table-column>
      <el-table-column v-if="!isImport" label="操作" width="100">
        <template slot-scope="scope">
          <i class="el-icon-refresh" @click="resetPwConfirm(scope.row.id)"></i>
          <i class="el-icon-edit" @click="editData(scope.row.id)"></i>
          <i
            class="el-icon-delete"
            @click="datasDeleteConfirm([scope.row.id])"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="listWarp2">
      <div class="listPage" v-if="list.length !== 0">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page="pageIndex"
          :total="listCount"
          @current-change="pageChange"
          background
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Loading,
  Message,
  MessageBox,
  Pagination,
  Table,
  TableColumn
} from "element-ui";
import { downloadExl } from "@/assets/js/tool";
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "teacherList",
  components: {
    elPagination: Pagination,
    elTable: Table,
    elTableColumn: TableColumn
  },
  props: {
    listExcel: Array,
    isImport: Boolean
  },
  data() {
    return {
      list: [],
      listCount: null,
      loadingOpts: {
        target: "",
        fullscreen: false
      },
      currentId: null,
      pageSize: 6,
      pageIndex: 1,
      rowStyle: {
        height: "100px"
      },
      i18n: {
        realname: "姓名",
        number: "职工号",
        sex: "性别",
        phone: "电话",
        address: "地址",
        email: "邮箱",
        description: "个人描述"
      },
      selectedId: []
    };
  },
  computed: {
    ...mapState({
      searchValue: state => state.searchValue,
      token: state => state.userInfo.token
    })
  },
  watch: {
    listExcel(newV) {
      this.listCount = newV.length;
      this.list = newV.slice(0, this.pageSize);
    },
    searchValue() {
      this.pageIndex = 1;
      this.getList();
    }
  },
  mounted() {
    this.loadingOpts.target = document.getElementById("list");
    if (!this.listExcel) {
      this.getList();
    }
  },
  methods: {
    ...mapActions(["clearUserInfo"]),
    ...mapMutations({
      clearUserInfoM: "clearUserInfo"
    }),
    async getList() {
      let loading = Loading.service(this.loadingOpts);
      const { data: res } = await this.$http.getTeacherList({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        searchValue: this.searchValue,
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        let listTemp = res.data.list.map(item => {
          if (item.sex) {
            item.sex = "男";
          } else {
            item.sex = "女";
          }
          return item;
        });
        this.list = listTemp;
        this.listCount = res.data.count;
        this.$emit("changeCount", this.listCount);
      } else {
        Message.error(res.msg);
      }
    },
    selectedChange(selection) {
      this.selectedId = selection.map(item => item.id);
    },
    resetPwConfirm(id) {
      MessageBox.confirm("此操作将重置该用户密码为职工号，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: action => {
          switch (action) {
            case "cancel":
            case "close":
              Message.info("取消重置");
              break;
            case "confirm":
              this.resetPw(id);
              break;
          }
        }
      });
    },
    async resetPw(id) {
      const { data: res } = await this.$http.resetPwTeacher({
        id: id,
        token: this.token
      });
      if (res.code === 200) {
        Message.success(res.msg);
        if (res.data.changeByOwn) {
          this.clearUserInfo().then(() => {
            this.clearUserInfoM();
          });
          MessageBox.confirm("当前用户密码已重置，请重新登录", "密码重置", {
            cancelButtonText: "回到首页",
            confirmButtonText: "登录",
            type: "warning",
            callback: action => {
              switch (action) {
                case "cancel":
                case "close":
                  location.href = "index.html";
                  break;
                case "confirm":
                  location.href = "login.html";
                  break;
              }
            }
          });
        }
      } else {
        Message.error(res.msg);
      }
    },
    editData(id) {
      this.$emit("openDetailLog", id);
    },
    datasDeleteConfirm(ids) {
      if (ids.length <= 0) {
        Message.warning({
          message: "请选择至少一个教师"
        });
        return;
      }
      MessageBox.confirm("此操作将删除所选教师的所有信息，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: action => {
          switch (action) {
            case "cancel":
            case "close":
              Message.info("取消删除");
              break;
            case "confirm":
              this.datasDelete(ids);
              break;
          }
        }
      });
    },
    async datasDelete(ids) {
      const { data: res } = await this.$http.delTeachers({
        teachersId: ids,
        token: this.token
      });
      if (res.code === 200) {
        Message.success(res.msg);
        if (this.list.length % this.pageSize == ids.length) {
          this.pageIndex--;
        }
        this.getList();
      } else {
        Message.error(res.msg);
      }
    },
    listExportConfirm() {
      MessageBox.confirm("确认导出当前列表数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback: action => {
          switch (action) {
            case "cancel":
            case "close":
              Message.info("取消导出");
              break;
            case "confirm":
              this.listExport();
              break;
          }
        }
      });
    },
    async listExport() {
      let allList;
      let loading = Loading.service({
        text: "获取数据导出中，请稍候..."
      });
      const { data: res } = await this.$http.getAllTeacherList({
        token: this.token
      });
      if (res.code === 200) {
        if (res.data.length) {
          let listTemp = res.data;
          allList = listTemp.map(item => {
            if (item[this.i18n["sex"]] == 1) {
              item[this.i18n["sex"]] = "男";
            } else {
              item[this.i18n["sex"]] = "女";
            }
            return item;
          });
          downloadExl(allList, "xlsx", "教师列表");
        } else {
          Message.info("暂无教师信息");
        }
      } else {
        Message.error(res.msg);
      }
      loading.close();
    },
    importListChange() {
      this.list = this.listExcel.slice(
        this.pageSize * (this.pageIndex - 1),
        this.pageSize + this.pageSize * (this.pageIndex - 1)
      );
    },
    pageChange(page) {
      this.pageIndex = page;
      if (!this.isImport) {
        this.getList();
      } else {
        this.importListChange();
      }
    }
  }
};
</script>
