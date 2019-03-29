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
      ref="colleges-list"
      @openLogoLog="openLogoLog"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <CollegeListImport
      @listChange="listChange"
      v-if="showImportLog"
    />
    <CollegeLogoLog 
      v-if="showLogoLog"
      :collegeId="currentId"
      @logoDelete="logoDelete"
      @logoChange="logoChange"
    />
    <CollegeDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
      @dataChange="dataChange"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox";
import CollegeList from "./components/CollegeList";
import ListWarp from "./../components/ListWarp";

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
    selectedId() {
      return this.$refs["colleges-list"].selectedId.map(
        (value, index, array) => {
          return {
            id: array[index]["id"]
          };
        }
      );
    },
    showLogoLog() {
      return this.$store.state.showLogoLog;
    },
    showDetailLog() {
      return this.$store.state.showDetailLog;
    },
    showImportLog() {
      return this.$store.state.showImportLog;
    }
  },
  methods: {
    changeCount(count) {
      this.count = count;
    },
    logoChange(data) {
      this.$refs["colleges-list"].logoChange(data);
    },
    logoDelete(data) {
      this.$refs["colleges-list"].logoDelete(data);
    },
    listChange() {
      this.$refs["colleges-list"].getList();
    },
    dataChange(data) {
      this.$refs["colleges-list"].dataChange(data);
    },
    datasDelete() {
      this.$refs["colleges-list"].datasDeleteConfirm(
        this.$refs["colleges-list"].selectedId
      );
    },
    listExport() {
      this.$refs["colleges-list"].listExportConfirm();
    },
    openLogoLog(id) {
      this.currentId = id;
      this.$store.commit("switchLogoLog");
    },
    openDetailLog(id) {
      this.currentId = id;
      this.$store.commit("switchDetailLog");
    }
  }
};
</script>
