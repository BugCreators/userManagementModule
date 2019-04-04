<template>
  <div>
    <SearchBox :moduleName="moduleName" 
      :basisOfClass="true" />
    <ListWarp
      :addFuncName="addFuncName"
      :count="count"
      :delFuncName="delFuncName"
      :exportFuncName="exportFuncName"
      :moduleName="moduleName"
      @datasDeleteConfirm="datasDelete"
      @openDetailLog="openDetailLog"
      @switchExportLog="switchExportLog"
    />
    <StudentList
      ref="list"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <StudentListImport @listChange="listChange" v-if="showImportLog" />
    <StudentDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
    />
    <StudentListExport v-if="showExportLog" :showExportLog="showExportLog" @switchExportLog="switchExportLog"/>
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox";
import StudentList from "./components/StudentList";
import ListWarp from "./../components/ListWarp";

export default {
  name: "student",
  components: {
    StudentListImport: () =>
      import(/* webpackChunkName: "studentListImport" */ "./components/StudentListImport"),
    StudentDetailLog: () =>
      import(/* webpackChunkName: "studentDetailLog" */ "./components/StudentDetailLog"),
    StudentListExport: () =>
      import(/* webpackChunkName: "studentListExport" */ "./components/StudentListExport"),
    StudentList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "student",
      addFuncName: "openDetailLog",
      delFuncName: "datasDeleteConfirm",
      exportFuncName: "switchExportLog",
      showExportLog: false
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
    switchExportLog() {
      this.showExportLog = !this.showExportLog;
    },
    openDetailLog(id) {
      this.currentId = id;
      this.$store.commit("switchDetailLog");
    }
  }
};
</script>
