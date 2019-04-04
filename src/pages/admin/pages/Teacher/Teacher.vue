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
    <TeacherList
      ref="list"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <TeacherListImport @listChange="listChange" v-if="showImportLog" />
    <TeacherDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox";
import TeacherList from "./components/TeacherList";
import ListWarp from "./../components/ListWarp";

export default {
  name: "teacher",
  components: {
    TeacherListImport: () =>
      import(/* webpackChunkName: "teacherListImport" */ "./components/TeacherListImport"),
    TeacherDetailLog: () =>
      import(/* webpackChunkName: "teacherDetailLog" */ "./components/TeacherDetailLog"),
    TeacherList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "teacher",
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
