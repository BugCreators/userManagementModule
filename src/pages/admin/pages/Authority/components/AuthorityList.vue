<template>
  <div class="authorityList">
    <el-table
      id="authorityList"
      :data="authorityList"
      @selection-change="selectedChange"
    >
      <el-table-column
        label="权限名"
        prop="cn_name"
        width="200"
      ></el-table-column>
      <el-table-column label="英文名" prop="name" width="200"></el-table-column>
      <el-table-column label="权限描述" prop="description"></el-table-column>
      <el-table-column label="所属模块" prop="moduleName"></el-table-column>
    </el-table>
    <div class="listWarp2">
      <div class="listPage" v-if="authorityList.length !== 0">
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
import { mapState } from "vuex";

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
    ...mapState({
      searchValue: state => state.searchValue,
      token: state => state.userInfo.token
    })
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
    async getAuthorityList() {
      const loading = Loading.service(this.loadingOpts);
      const { data: res } = await this.$http.getAuthorityList({
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        searchValue: this.searchValue,
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        this.authorityList = res.data.list;
        this.authorityListCount = res.data.count;
        this.$emit("changeCount", this.authorityListCount);
      } else {
        Message.error(res.msg || "获取列表失败，请稍后再试");
      }
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
