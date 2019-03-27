<template>
  <div class="collegeList">
    <el-table :data="collegeList" @selection-change="selectedChange">
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="学院名" prop="name" width="200"></el-table-column>
      <el-table-column label="英文名" prop="english_name" width="200"></el-table-column>
      <el-table-column v-if="!isImport" label="院徽" width="150">
        <template slot-scope="scope">
          <el-popover placement="right" trigger="hover">
            <AvueImage
              :srcImage="scope.row.logo || $store.state.defaultCollege"
              :replaceImage="$store.state.defaultCollege"
            />
            <AvueImage
              slot="reference"
              :className="['thumbnail']"
              :srcImage="scope.row.logo || $store.state.defaultCollege"
              :replaceImage="$store.state.defaultCollege"
            />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="官网链接"
        prop="website"
        width="200"
      ><template slot-scope="scope">
        <a target="_blank" :href="scope.row.website">{{ scope.row.website }}</a>
      </template></el-table-column>
      <el-table-column label="学院描述" prop="description"></el-table-column>
      <el-table-column
        v-if="isImport"
        label="消息"
        prop="message"
        width="100"
        :class-name="'errorMsg'"
      ></el-table-column>
      <el-table-column v-if="!isImport" label="操作" width="100">
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
          :total="collegeListCount"
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
  props: {
    collegeListExcel: Array,
    isImport: Boolean
  },
  data() {
    return {
      collegeList: [],
      collegeListCount: null,
      collegeDetail: {
        id: "",
        name: ""
      },
      currentCollegeId: null,
      pageSize: 6,
      pageIndex: 1,
      selectedCollegeId: []
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
    collegeListExcel(newV) {
      this.collegeListCount = newV.length;
      this.collegeList = newV.slice(0, this.pageSize);
    },
    searchValue() {
      this.getCollegeList();
    }
  },
  created() {
    if (!this.collegeListExcel) {
      this.getCollegeList();
    }
  },
  methods: {
    getCollegeList() {
      let that = this;
      return this.$store.dispatch("postItems", {
        url: that.$store.state.getCollegeListByAdmin,
        query: {
          pageSize: that.pageSize,
          pageIndex: that.pageIndex,
          searchValue: that.searchValue,
          token: that.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            that.collegeList = res.data.list;
            that.collegeListCount = res.data.count;
            that.$emit("amountOfData", that.collegeListCount);
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
    editCollege(collegeId) {
      this.$emit("openDetailLog", collegeId);
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
    importListChange() {
      this.collegeList = this.collegeListExcel.slice(
        5 * (this.pageIndex - 1),
        5 + 5 * (this.pageIndex - 1)
      );
    },
    pageChange(page) {
      this.pageIndex = page;
      if (!this.isImport) {
        this.getCollegeList();
      } else {
        this.importListChange();
      }
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
  .collegeListPage {
    float: right;
    line-height: 2;
  }
}
</style>
