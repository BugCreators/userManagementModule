<template>
  <div class="majorList">
    <el-table
      id="list"
      :row-style="rowStyle"
      :data="list"
      @selection-change="selectedChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column
        prop="name"
        width="100"
        :label="i18n['name']"
      ></el-table-column>
      <el-table-column
        prop="level"
        width="200"
        :label="i18n['level']"
      ></el-table-column>
      <el-table-column
        prop="collegeName"
        width="200"
        :label="i18n['collegeName']"
      ></el-table-column>
      <el-table-column
        prop="description"
        :label="i18n['description']"
      ></el-table-column>
      <el-table-column
        prop="train_objective"
        :label="i18n['train_objective']"
      ></el-table-column>
      <el-table-column
        prop="main_course"
        :label="i18n['main_course']"
      ></el-table-column>
      <el-table-column
        prop="employment_direction"
        :label="i18n['employment_direction']"
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
  Popover,
  Table,
  TableColumn
} from "element-ui";
import AvueImage from "@/components/AvueImage";
import { downloadExl } from "@/assets/js/tool";

export default {
  name: "majorList",
  components: {
    AvueImage,
    elPagination: Pagination,
    elPopover: Popover,
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
        name: "专业名",
        level: "学历层次",
        collegeName: "所属学院",
        description: "专业概况",
        train_objective: "培养目标",
        main_course: "主要课程",
        employment_direction: "就业方向"
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
      console.log(2222);
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
        url: that.$store.state.getMajorList,
        query: {
          pageSize: that.pageSize,
          pageIndex: that.pageIndex,
          searchValue: that.searchValue,
          token: that.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.list = res.data.list;
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
    changeLogo(id) {
      this.$emit("openLogoLog", id);
    },
    editData(id) {
      this.$emit("openDetailLog", id);
    },
    logoChange(data) {
      let loading = Loading.service(this.loadingOpts);
      for (let i = 0, len = this.list.length; i < len; i++) {
        if (this.list[i].id == data.id) {
          this.list[i].logo = data.url;
          loading.close();
          return;
        }
      }
      loading.close();
    },
    logoDelete(data) {
      let loading = Loading.service(this.loadingOpts);
      for (let i = 0, len = this.list.length; i < len; i++) {
        if (this.list[i].id == data) {
          this.list[i].logo = null;
          loading.close();
          return;
        }
      }
      loading.close();
    },
    dataChange(data) {
      let loading = Loading.service(this.loadingOpts);
      for (let i = 0, len = this.list.length; i < len; i++) {
        if (this.list[i].id == data.id) {
          this.list[i] = data;
          return;
        }
      }
      loading.close();
    },
    datasDeleteConfirm(ids) {
      let that = this;
      if (ids.length <= 0) {
        Message.warning({
          message: "请选择至少一个学院"
        });
        return;
      }
      MessageBox.confirm("此操作将删除所选学院的所有信息，是否继续？", "提示", {
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
        url: this.$store.state.delMajors,
        query: {
          majorsId: ids,
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
    listExportConfirm() {
      let that = this;
      MessageBox.confirm("确认导出当前列表数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        callback(action) {
          switch (action) {
            case "cancel":
            case "close":
              Message.info("取消导出");
              break;
            case "confirm":
              that.listExport();
              break;
          }
        }
      });
    },
    listExport() {
      let allList,
        that = this;
      let loading = Loading.service({
        text: "获取数据导出中，请稍候..."
      });
      return this.$store.dispatch("postItems", {
        url: that.$store.state.getAllMajorList,
        query: {
          token: that.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            allList = res.data;
            downloadExl(allList, "xlsx", "专业列表");
          } else {
            Message.error(res.msg);
          }
          loading.close();
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
