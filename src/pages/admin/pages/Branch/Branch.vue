<template>
  <div>
    <SearchBox
      :moduleName="moduleName"
      :showSelect="true"
      :basisOfCollege="false"
      :basisOfLevel="true"
    />
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
    <BranchList
      ref="list"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <BranchListImport @listChange="listChange" v-if="showImportLog" />
    <BranchDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
      @dataChange="dataChange"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox";
import BranchList from "./components/BranchList";
import ListWarp from "./../components/ListWarp";

export default {
  name: "branch",
  components: {
    BranchListImport: () =>
      import(/* webpackChunkName: "branchListImport" */ "./components/BranchListImport"),
    BranchDetailLog: () =>
      import(/* webpackChunkName: "branchDetailLog" */ "./components/BranchDetailLog"),
    BranchList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "branch",
      addFuncName: "openDetailLog",
      delFuncName: "datasDeleteConfirm",
      exportFuncName: "listExportConfirm"
    };
  },
  computed: {
    selectedId() {
      return this.$refs["list"].selectedId.map((value, index, array) => {
        return {
          id: array[index]["id"]
        };
      });
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
      this.$refs["list"].datasDeleteConfirm(this.$refs["list"].selectedId);
    },
    listExport() {
      this.$refs["list"].listExportConfirm();
    },
    openDetailLog(id) {
      this.currentId = id;
      this.$store.commit("switchDetailLog");
    }
  }
};
</script>
