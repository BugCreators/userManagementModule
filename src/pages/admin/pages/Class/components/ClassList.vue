<template>
  <div class="classList">
    <el-table
      id="list"
      :row-style="rowStyle"
      :data="list"
      @selection-change="selectedChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column
        prop="grade"
        width="100"
        :label="i18n['grade']"
      ></el-table-column>
      <el-table-column prop="name" :label="i18n['name']"></el-table-column>
      <el-table-column
        prop="majorName"
        :label="i18n['majorName']"
      ></el-table-column>
      <el-table-column
        v-if="!isImport"
        prop="collegeName"
        :label="i18n['collegeName']"
      ></el-table-column>
      <el-table-column
        prop="studentCount"
        :label="i18n['studentCount']"
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
import { downloadExl } from "@/assets/js/tool";
import { mapState } from "vuex";

export default {
  name: "classList",
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
        grade: "年级",
        name: "班级名",
        majorName: "专业名",
        collegeName: "学院"
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
      const loading = Loading.service(this.loadingOpts);
      const res = await this.$http.getClassList({
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
    editData(id) {
      this.$emit("openDetailLog", id);
    },
    datasDeleteConfirm(ids) {
      if (ids.length <= 0) {
        Message.warning({
          message: "请选择至少一个班级"
        });
        return;
      }
      avueMsgBox({
        message: "此操作将删除所选班级，是否继续？"
      })
        .then(() => this.datasDelete(ids))
        .catch(() => Message.info("取消删除"));
    },
    async datasDelete(ids) {
      const res = await this.$http.delClass({
        classId: ids,
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
      avueMsgBox({
        message: "确认导出当前列表数据？"
      })
        .then(() => this.listExport())
        .catch(() => Message.info("取消导出"));
    },
    async listExport() {
      let allList;
      const loading = Loading.service({
        text: "获取数据导出中，请稍候..."
      });
      const res = await this.$http.getAllClassList({
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        allList = res.data;
        downloadExl(allList, "xlsx", "班级列表");
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
