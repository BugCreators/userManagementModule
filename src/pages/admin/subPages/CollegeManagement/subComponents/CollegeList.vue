<template>
  <div class="collegeList">
    <div class="listWarp">
      <el-button type="primary" @click="openLog(0)">添加学院</el-button>
    </div>
    <el-table :data="collegeList" @selection-change="selectedChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="学院名" prop="name" width="200"></el-table-column>
      <el-table-column label="院徽" width="150">
        <template slot-scope="scope">
          <AvueImage
            :srcImage="scope.row.coverUri || $store.state.defaultCollege"
            :replaceImage="$store.state.defaultCollege"
          />
        </template>
      </el-table-column>
      <el-table-column label="学院描述" prop="des"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="openLog(scope.row.id)"></i>
          <i class="el-icon-delete" @click="collegesDel([scope.row.id])"></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="listWarp2">
      <el-button type="danger" @click="collegesDel(selectedCollegeId)"
        >删除</el-button
      >
      <div class="collegeListPage" v-if="collegeList.length !== 0">
        <el-pagination
          layout="prev, pager, next"
          :page-size="pageSize"
          :current-page="pageIndex"
          :total="collegeList.length"
          @current-change="pageChange"
          background
        >
        </el-pagination>
      </div>
    </div>
    <CollegeEditLog
      v-if="showEditLog"
      @closelog="closelog"
      :collegeId="currentCollegeId"
      :showEditLog="showEditLog"
    />
  </div>
</template>

<script>
import {
  Button,
  Message,
  MessageBox,
  Pagination,
  Table,
  TableColumn
} from "element-ui";
import AvueImage from "@/components/AvueImage";

export default {
  name: "collegeList",
  components: {
    AvueImage,
    CollegeEditLog: () =>
      import(/* webpackChunkName: "collegeEditLog" */ "./CollegeEditLog"),
    elButton: Button,
    elPagination: Pagination,
    elTable: Table,
    elTableColumn: TableColumn
  },
  data() {
    return {
      collegeList: [
        { id: 1, name: "教育学院" },
        { id: 2, name: "教育学院" },
        { id: 3, name: "教育学院" },
        { id: 4, name: "教育学院" },
        { id: 5, name: "教育学院" }
      ],
      collegeDetail: {
        id: "",
        name: ""
      },
      currentCollegeId: null,
      pageSize: 5,
      pageIndex: 1,
      selectedCollegeId: [],
      showEditLog: false
    };
  },
  created() {},
  methods: {
    getCollegeList() {
      let that = this;
      return this.$store.dispatch("getItems", {
        url: that.$store.state.getCollegeList,
        query: {
          pageSize: that.pageSize,
          pageIndex: that.pageIndex,
          token: that.$store.state.userInfo.token
        },
        cb(res) {
          if (res.success) {
            that.collegeList = res.list;
          } else {
            Message.error({
              message: res.message || "获取列表失败，请稍后再试"
            });
          }
        }
      });
    },
    selectedChange(selection) {
      this.selectedCollegeId = selection;
    },
    openLog(collegeId) {
      this.currentCollegeId = collegeId;
      this.showEditLog = true;
    },
    closelog() {
      this.currentCollegeId = null;
      this.showEditLog = false;
    },
    collegesDel(collegesId) {
      let that = this;
      if (!collegesId.length) {
        Message.warning({
          message: "请选择至少一个学院"
        });
        return;
      }
      MessageBox.confirm("此操作将删除所选学院的所有信息，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          that.$store.dispatch("postArrItems", {
            url: that.$store.state.delColleges,
            query: {
              collegesId,
              username: that.$store.state.userInfo.username,
              token: that.$store.state.userInfo.token
            },
            cb(res) {
              if (res.success) {
                Message.success({
                  message: res.message || "删除成功！"
                });
              } else {
                Message.error({
                  message: res.message || "删除失败！"
                });
              }
            }
          });
        })
        .catch(() => {
          Message.warning({
            message: "取消删除"
          });
        });
    },
    pageChange(page) {
      this.pageIndex = page;
      this.getCollegeList();
    }
  }
};
</script>

<style lang="less" scoped>
.collegeList {
  padding: 0 50px;
}
.listWarp {
  margin-bottom: 10px;
  overflow: hidden;
  button {
    float: right;
  }
}
.listWarp2 {
  margin: 10px 0 20px;
  .collegeListPage {
    float: right;
  }
}
</style>
