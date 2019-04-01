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
      return this.$refs["list"].selectedId.map(
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
  created() {
    this.$store.commit("setSearchValue", {
      basis: 0,
      name: ""
    });
  },
  methods: {
    changeCount(count) {
      this.count = count;
    },
    logoChange(data) {
      this.$refs["list"].logoChange(data);
    },
    logoDelete(data) {
      this.$refs["list"].logoDelete(data);
    },
    listChange() {
      this.$refs["list"].getList();
    },
    dataChange(data) {
      this.$refs["list"].dataChange(data);
    },
    datasDelete() {
      this.$refs["list"].datasDeleteConfirm(
        this.$refs["list"].selectedId
      );
    },
    listExport() {
      this.$refs["list"].listExportConfirm();
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
