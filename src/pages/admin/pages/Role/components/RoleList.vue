<template>
  <div class="rolementList">
    <el-table
      id="list"
      :row-style="rowStyle"
      :data="list"
      @selection-change="selectedChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="name" :label="i18n['name']"></el-table-column>
      <el-table-column
        prop="description"
        :label="i18n['description']"
      ></el-table-column>
      <el-table-column :label="i18n['permission']"
        ><template slot-scope="scope">
          <span v-for="item in scope.row.permission" :key="item.index">{{
            item.cn_name + "，"
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="level" :label="i18n['level']"></el-table-column>
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
  Table,
  TableColumn
} from "element-ui";

export default {
  name: "roleList",
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
        name: "角色名",
        description: "角色介绍",
        permission: "拥有权限",
        level: "权限等级"
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
    getList() {
      let that = this;
      let loading = Loading.service(this.loadingOpts);
      return this.$store.dispatch("postItems", {
        url: that.$store.state.getRoleList,
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
      }
      loading.close();
    },
    datasDeleteConfirm(ids) {
      let that = this;
      if (ids.length <= 0) {
        Message.warning({
          message: "请选择至少一个角色"
        });
        return;
      }
      MessageBox.confirm("此操作将删除所选角色，是否继续？", "提示", {
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
        url: this.$store.state.delRoles,
        query: {
          rolesId: ids,
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
