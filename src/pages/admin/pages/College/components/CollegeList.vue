<template>
  <div class="collegeList">
    <el-table
      id="collegeList"
      :row-style="rowStyle"
      :data="collegeList"
      @selection-change="selectedChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="学院名" prop="name" width="100"></el-table-column>
      <el-table-column
        label="英文名"
        prop="english_name"
        width="200"
      ></el-table-column>
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
      <el-table-column label="官网链接" prop="website" width="200"
        ><template slot-scope="scope">
          <a target="_blank" :href="scope.row.website">{{
            scope.row.website
          }}</a>
        </template></el-table-column
      >
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
            @click="collegesDelConfirm([scope.row.id])"
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
  Loading,
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
      loadingOpts: {
        target: "",
        fullscreen: false
      },
      currentCollegeId: null,
      pageSize: 6,
      pageIndex: 1,
      rowStyle: {
        height: "100px"
      },
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
  mounted() {
    this.loadingOpts.target = document.getElementById("collegeList");
    if (!this.collegeListExcel) {
      this.getCollegeList();
    }
  },
  methods: {
    getCollegeList() {
      let that = this;
      let loading = Loading.service(this.loadingOpts);
      return this.$store.dispatch("postItems", {
        url: that.$store.state.getCollegeListByAdmin,
        query: {
          pageSize: that.pageSize,
          pageIndex: that.pageIndex,
          searchValue: that.searchValue,
          token: that.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            that.collegeList = res.data.list;
            that.collegeListCount = res.data.count;
            that.$emit("changeCount", that.collegeListCount);
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    selectedChange(selection) {
      console.log(selection.map(item => item.id));
      this.selectedCollegeId = selection.map(item => item.id);
    },
    editCollege(collegeId) {
      this.$emit("openDetailLog", collegeId);
    },
    collegeChange(data) {
      let loading = Loading.service(this.loadingOpts);
      for (let i = 0, len = this.collegeList.length; i < len; i++) {
        if (this.collegeList[i].id == data.id) {
          this.collegeList[i] = data;
          return;
        }
      }
      loading.close();
    },
    collegesDelConfirm(collegesId) {
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
        type: "warning",
        callback(action) {
          switch (action) {
            case "cancel":
            case "close":
              Message.info("取消删除");
              break;
            case "confirm":
              that.collegesDel(collegesId);
              break;
          }
        }
      });
    },
    collegesDel(collegesId) {
      let that = this;
      this.$store.dispatch("postItems", {
        url: this.$store.state.delColleges,
        query: {
          collegesId,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            Message.success(res.msg);
            if (that.collegeList.length % that.pageSize == 1) {
              that.pageIndex--;
            }
            that.getCollegeList();
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    importListChange() {
      this.collegeList = this.collegeListExcel.slice(
        this.pageSize * (this.pageIndex - 1),
        this.pageSize + this.pageSize * (this.pageIndex - 1)
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
