<template>
  <div>
    <SearchBox :moduleName="moduleName" />
    <ListWarp
      :addFuncName="addFuncName"
      :count="count"
      :delFuncName="delFuncName"
      :exportFuncName="exportFuncName"
      :moduleName="moduleName"
      @collegesDelConfirm="collegesDel"
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
      @collegeListChange="collegeListChange"
      v-if="showImportLog"
    />
    <CollegeLogoLog 
      v-if="showLogoLog"
      :collegeId="currentCollegeId"
      @logoDelete="logoDelete"
      @logoChange="logoChange"
    />
    <CollegeDetailLog
      v-if="showDetailLog"
      :collegeId="currentCollegeId"
      @collegeListChange="collegeListChange"
      @collegeChange="collegeChange"
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
      currentCollegeId: undefined,
      moduleName: "college",
      addFuncName: "openDetailLog",
      delFuncName: "collegesDelConfirm",
      exportFuncName: "listExportConfirm"
    };
  },
  computed: {
    selectedCollegeId() {
      return this.$refs["colleges-list"].selectedCollegeId.map(
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
    collegeListChange() {
      this.$refs["colleges-list"].getCollegeList();
    },
    collegeChange(data) {
      this.$refs["colleges-list"].collegeChange(data);
    },
    collegesDel() {
      this.$refs["colleges-list"].collegesDelConfirm(
        this.$refs["colleges-list"].selectedCollegeId
      );
    },
    listExport() {
      this.$refs["colleges-list"].listExportConfirm();
    },
    openLogoLog(collegeId) {
      this.currentCollegeId = collegeId;
      this.$store.commit("switchLogoLog");
    },
    openDetailLog(collegeId) {
      this.currentCollegeId = collegeId;
      this.$store.commit("switchDetailLog");
    }
  }
};
</script>
