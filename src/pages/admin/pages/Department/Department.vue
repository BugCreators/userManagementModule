<template>
  <div>
    <SearchBox :moduleName="moduleName" :showSelect="true" />
    <ListWarp
      :count="count"
      :moduleName="moduleName"
      @datasDeleteConfirm="datasDelete"
      @openDetailLog="openDetailLog"
      @listExportConfirm="listExport"
    />
    <DepartmentList
      ref="list"
      @openLogoLog="openLogoLog"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <DepartmentListImport @listChange="listChange" v-if="showImportLog" />
    <DepartmentDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox/SearchBox";
import ListWarp from "./../components/ListWarp/ListWarp";
import DepartmentList from "./components/DepartmentList";
import { mapMutations, mapState } from "vuex";

export default {
  name: "department",
  components: {
    DepartmentListImport: () =>
      import(
        /* webpackChunkName: "departmentListImport" */ "./components/DepartmentListImport"
      ),
    DepartmentDetailLog: () =>
      import(
        /* webpackChunkName: "departmentDetailLog" */ "./components/DepartmentDetailLog"
      ),
    DepartmentList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "department"
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
