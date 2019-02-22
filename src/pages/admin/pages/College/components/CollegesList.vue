<template>
  <div class="collegeList">
    <el-table :data="collegeList" @selection-change="selectedChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="学院名" prop="name" width="200"></el-table-column>
      <el-table-column label="院徽" width="150">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <AvueImage
              :srcImage="scope.row.coverUri || $store.state.defaultCollege"
              :replaceImage="$store.state.defaultCollege"
            />
            <AvueImage
              :className="[thumbnail]"
              slot="reference"
              :srcImage="scope.row.coverUri || $store.state.defaultCollege"
              :replaceImage="$store.state.defaultCollege"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="官网链接" prop="" width="200"></el-table-column>
      <el-table-column label="学院描述" prop="des"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <i class="el-icon-edit" @click="editCollege(scope.row.id)"></i>
          <i
            class="el-icon-delete"
            @click="collegesdel([{ id: scope.row.id }])"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="listWarp2">
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
  </div>
</template>

<script>
import {
  Message,
  MessageBox,
  Pagination,
  Popover,
  Table,
  TableColumn
} from "element-ui";
import AvueImage from "@/components/AvueImage";

export default {
  name: "collegeList",
  components: {
    AvueImage,
    elPagination: Pagination,
    elPopover: Popover,
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
      thumbnail: "thumbnail"
    };
  },
  created() {
    this.$emit("listamount", this.collegeList.length);//后期删除
  },
  computed: {
    showEditLog() {
      return this.$store.state.showLog;
    }
  },
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
      this.$emit("listamount", this.collegeList.length);
    },
    selectedChange(selection) {
      this.selectedCollegeId = selection;
    },
    editCollege(collegeId) {
      this.$emit("openlog", collegeId);
    },
    collegesdel(collegesId) {
      let that = this;
      if (collegesId.length <= 0) {
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
.listWarp2 {
  margin: 10px 0 20px;
  .collegeListPage {
    float: right;
    line-height: 2;
  }
}
</style>
