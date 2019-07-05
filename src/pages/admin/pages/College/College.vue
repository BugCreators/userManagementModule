<template>
  <div>
    <SearchBox :moduleName="moduleName" />
    <ListWarp
      :addFuncName="addFuncName"
      :count="count"
      :delFuncName="delFuncName"
      :exportFuncName="exportFuncName"
      :moduleName="moduleName"
      @datasDeleteConfirm="datasDelete"
      @openDetailLog="openDetailLog"
      @listExportConfirm="listExport"
    />
    <CollegeList
      ref="list"
      @openLogoLog="openLogoLog"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <CollegeListImport @listChange="listChange" v-if="showImportLog" />
    <CollegeLogoLog
      v-if="showLogoLog"
      :collegeId="currentId"
      @listChange="listChange"
    />
    <CollegeDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox/SearchBox";
import ListWarp from "./../components/ListWarp/ListWarp";
import CollegeList from "./components/CollegeList";
import { mapState, mapMutations } from "vuex";

export default {
  name: "college",
  components: {
    CollegeListImport: () =>
      import(/* webpackChunkName: "collegeListImport" */ "./components/CollegeListImport"),
    CollegeDetailLog: () =>
      import(/* webpackChunkName: "collegeDetailLog" */ "./components/CollegeDetailLog"),
    CollegeLogoLog: () =>
      import(/* webpackChunkName: "collegeLogoLog" */ "./components/CollegeLogoLog"),
    CollegeList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "college",
      addFuncName: "openDetailLog",
      delFuncName: "datasDeleteConfirm",
      exportFuncName: "listExportConfirm"
    };
  },
  computed: {
    ...mapState({
      showLogoLog: state => state.showLogoLog,
      showDetailLog: state => state.showDetailLog,
      showImportLog: state => state.showImportLog
    })
  },
  created() {
    this.setSearchValue({
      basis: 0,
      name: ""
    });
  },
  methods: {
    ...mapMutations(["setSearchValue", "switchLogoLog", "switchDetailLog"]),
    changeCount(count) {
      this.count = count;
    },
    listChange() {
      this.$refs["list"].getList();
    },
    datasDelete() {
      this.$refs["list"].datasDeleteConfirm(this.$refs["list"].selectedId);
    },
    listExport() {
      this.$refs["list"].listExportConfirm();
    },
    openLogoLog(id) {
      this.currentId = id;
      this.switchLogoLog();
    },
    openDetailLog(id) {
      this.currentId = id;
      this.switchDetailLog();
    }
  }
};
</script>
