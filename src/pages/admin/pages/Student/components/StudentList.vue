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
import { Loading, Message, Pagination, Table, TableColumn } from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import { mapState } from "vuex";

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
    async getList() {
      let loading = Loading.service(this.loadingOpts);
      const { data: res } = await this.$http.getStudentList({
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
      avueMsgBox({
        message: "此操作将重置该用户密码为学号，是否继续？"
      })
        .then(() => this.resetPw(id))
        .catch(() => Message.info("取消重置"));
    },
    async resetPw(id) {
      const { data: res } = await this.$http.resetPwStudent({
        id: id,
        token: this.token
      });
      if (res.code === 200) {
        Message.success(res.msg);
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
          message: "请选择至少一个学生"
        });
        return;
      }
      avueMsgBox({
        message: "此操作将删除所选学生的所有信息，是否继续？"
      })
        .then(() => this.datasDelete(ids))
        .catch(() => Message.info("取消删除"));
    },
    async datasDelete(ids) {
      const { data: res } = await this.$http.delStudents({
        studentsId: ids,
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
