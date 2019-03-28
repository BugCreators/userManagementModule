<template>
  <div class="authorityList">
    <el-table
      id="authorityList"
      :data="authorityList"
      @selection-change="selectedChange"
    >
      <el-table-column label="权限名" prop="name" width="200"></el-table-column>
      <el-table-column label="权限描述" prop="description"></el-table-column>
    </el-table>
    <div class="listWarp2">
      <div class="authorityListPage" v-if="authorityList.length !== 0">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page="pageIndex"
          :total="authorityListCount"
          @current-change="pageChange"
          background
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { Message, Loading, Pagination, Table, TableColumn } from "element-ui";

export default {
  name: "authorityList",
  components: {
    elPagination: Pagination,
    elTable: Table,
    elTableColumn: TableColumn
  },
  data() {
    return {
      authorityList: [],
      authorityCount: null,
      loadingOpts: {
        target: "",
        fullscreen: false
      },
      pageSize: 12,
      pageIndex: 1
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
    searchValue() {
      this.getAuthorityList();
    }
  },
  mounted() {
    this.loadingOpts.target = document.getElementById("authorityList");
    this.getAuthorityList();
  },
  methods: {
    getAuthorityList() {
      let that = this;
      let loading = Loading.service(this.loadingOpts);
      return this.$store.dispatch("postItems", {
        url: this.$store.state.getAuthorityList,
        query: {
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          searchValue: this.searchValue,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.authorityList = res.data.list;
            that.authorityListCount = res.data.count;
            that.$emit("changeCount", that.authorityListCount);
          } else {
            Message.error(res.msg || "获取列表失败，请稍后再试");
          }
        }
      });
    },
    selectedChange(selection) {
      this.selectedCollegeId = selection;
    },
    editCollege(collegeId) {
      this.$emit("openDetailLog", collegeId);
    },
    pageChange(page) {
      this.pageIndex = page;
      this.getAuthorityList();
    }
  }
};
</script>

<style lang="less" scoped>
.errorMsg {
  color: #dd6161 !important;
}
.listWarp2 {
  display: inline-block;
  margin: 10px 0 20px;
  width: 100%;
  .authorityListPage {
    float: right;
    line-height: 2;
  }
}
</style>
