<template>
  <div>
    <SearchBox
      :moduleName="moduleName"
      :showSelect="true"
      :basisOfCollege="false"
      :basisOfLevel="true"
    />
    <ListWarp
      :count="count"
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
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox/SearchBox";
import ListWarp from "./../components/ListWarp/ListWarp";
import BranchList from "./components/BranchList";
import { mapState, mapMutations } from "vuex";

export default {
  name: "branch",
  components: {
    BranchListImport: () =>
      import(
        /* webpackChunkName: "branchListImport" */ "./components/BranchListImport"
      ),
    BranchDetailLog: () =>
      import(
        /* webpackChunkName: "branchDetailLog" */ "./components/BranchDetailLog"
      ),
    BranchList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "branch"
    };
  },
  computed: {
    ...mapState({
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
    ...mapMutations(["setSearchValue", "switchDetailLog"]),
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
    openDetailLog(id) {
      this.currentId = id;
      this.switchDetailLog();
    }
  }
};
</script>
