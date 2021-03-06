<template>
  <div class="administratorList">
    <el-table
      id="list"
      :row-style="rowStyle"
      :data="list"
      @selection-change="selectedChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column
        v-if="!isImport"
        prop="branchName"
        label="部门"
      ></el-table-column>
      <el-table-column
        v-if="!isImport"
        prop="roleName"
        label="身份"
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
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading, Message, Pagination, Table, TableColumn } from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import { mapState, mapActions } from "vuex";

export default {
  name: "administratorList",
  components: {
    elPagination: Pagination,
    elTable: Table,
    elTableColumn: TableColumn
  },
  props: {
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
    searchValue() {
      this.pageIndex = 1;
      this.getList();
    }
  },
  mounted() {
    this.loadingOpts.target = document.getElementById("list");
    this.getList();
  },
  methods: {
    ...mapActions(["clearUserInfo"]),
    async getList() {
      const loading = Loading.service(this.loadingOpts);
      const res = await this.$http.getAdministratorList({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        searchValue: this.searchValue,
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        this.list = res.data.list;
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
        message: "此操作将重置该管理员密码为职工号，是否继续？"
      })
        .then(() => this.resetPw(id))
        .catch(() => Message.info("取消重置"));
    },
    async resetPw(id) {
      const res = await this.$http.resetPwAdmin({
        id,
        token: this.token
      });
      if (res.code === 200) {
        Message.success(res.msg);
        if (res.data.changeByOwn) {
          this.clearUserInfo();
          avueMsgBox(
            {
              message: "当前用户密码已重置，请重新登录",
              title: "密码重置"
            },
            1
          )
            .then(() => (location.href = "login.html"))
            .catch(() => (location.href = "index.html"));
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
          message: "请选择至少一个管理员"
        });
        return;
      }
      avueMsgBox({
        message: "此操作将删除所选管理员，是否继续？"
      })
        .then(() => this.datasDelete(ids))
        .catch(() => Message.info("取消删除"));
    },
    async datasDelete(ids) {
      const res = await this.$http.delAdministrators({
        adminsId: ids,
        token: this.token
      });
      if (res.code === 200) {
        Message.success(res.msg);
        if (this.list.length % this.pageSize === ids.length) {
          this.pageIndex--;
        }
        this.getList();
      } else {
        Message.error(res.msg);
      }
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
