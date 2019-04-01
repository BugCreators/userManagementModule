<template>
  <div>
    <SearchBox :moduleName="moduleName" :showSelect="true" />
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
    <ClassList
      ref="list"
      @openLogoLog="openLogoLog"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <ClassListImport @listChange="listChange" v-if="showImportLog" />
    <ClassDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
      @dataChange="dataChange"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox";
import ClassList from "./components/ClassList";
import ListWarp from "./../components/ListWarp";

export default {
  name: "class",
  components: {
    ClassListImport: () =>
      import(/* webpackChunkName: "ClassListImport" */ "./components/ClassListImport"),
    ClassDetailLog: () =>
      import(/* webpackChunkName: "ClassDetailLog" */ "./components/ClassDetailLog"),
    ClassList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "class",
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
