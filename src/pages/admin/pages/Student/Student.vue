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
      @listExportConfirm="listExport"
    />
    <StudentList
      ref="list"
      @openLogoLog="openLogoLog"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <StudentListImport @listChange="listChange" v-if="showImportLog" />
    <MajorDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
      @dataChange="dataChange"
    />
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
      this.$refs["list"].datasDeleteConfirm(this.$refs["list"].selectedId);
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
