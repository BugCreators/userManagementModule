<template>
  <div class="studentList">
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
        v-if="!isImport"
        prop="className"
        label="班级"
      ></el-table-column>
      <el-table-column
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

export default {
  name: "studentList",
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
        number: "学号",
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
    searchValue() {
      return this.$store.state.searchValue;
    },
    showDetailLog() {
      return this.$store.state.showDetailLog;
    }
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
    getList() {
      let that = this;
      let loading = Loading.service(this.loadingOpts);
      return this.$store.dispatch("postItems", {
        url: that.$store.state.getStudentList,
        query: {
          pageSize: that.pageSize,
          pageIndex: that.pageIndex,
          searchValue: that.searchValue,
          token: that.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            let listTemp = res.data.list.map(item => {
              if (item.sex) {
                item.sex = "男";
              } else {
                item.sex = "女";
              };
              return item;
            });
            that.list = listTemp;
            that.listCount = res.data.count;
            that.$emit("changeCount", that.listCount);
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    selectedChange(selection) {
      this.selectedId = selection.map(item => item.id);
    },
    resetPwConfirm(id) {
      let that = this;
      MessageBox.confirm("此操作将重置该用户密码为学号，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback(action) {
          switch (action) {
            case "cancel":
            case "close":
              Message.info("取消重置");
              break;
            case "confirm":
              that.resetPw(id);
              break;
          }
        }
      });
    },
    resetPw(id) {
      this.$store.dispatch('getItems', {
        url: this.$store.state.resetPw,
        query: {
          id: id,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            Message.success(res.msg);
          } else {
            Message.error(res.msg);
          }
        }
      })
    },
    editData(id) {
      this.$emit("openDetailLog", id);
    },
    dataChange(data) {
      let loading = Loading.service(this.loadingOpts);
      for (let i = 0, len = this.list.length; i < len; i++) {
        if (this.list[i].id == data.id) {
          this.list[i] = data;
          return;
        }
      };
      loading.close();
    },
    datasDeleteConfirm(ids) {
      let that = this;
      if (ids.length <= 0) {
        Message.warning({
          message: "请选择至少一个学生"
        });
        return;
      }
      MessageBox.confirm("此操作将删除所选学生的所有信息，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback(action) {
          switch (action) {
            case "cancel":
            case "close":
              Message.info("取消删除");
              break;
            case "confirm":
              that.datasDelete(ids);
              break;
          }
        }
      });
    },
    datasDelete(ids) {
      let that = this;
      this.$store.dispatch("postItems", {
        url: this.$store.state.delStudents,
        query: {
          studentsId: ids,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            Message.success(res.msg);
            if (that.list.length % that.pageSize == ids.length) {
              that.pageIndex--;
            }
            that.getList();
          } else {
            Message.error(res.msg);
          }
        }
      });
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
