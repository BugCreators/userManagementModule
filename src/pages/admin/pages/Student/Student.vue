<template>
  <div>
    <SearchBox :moduleName="moduleName" :basisOfClass="true" />
    <ListWarp
      :count="count"
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
    <StudentListExport
      v-if="showExportLog"
      :showExportLog="showExportLog"
      @switchExportLog="switchExportLog"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox/SearchBox";
import ListWarp from "./../components/ListWarp/ListWarp";
import StudentList from "./components/StudentList";
import { mapState, mapMutations } from "vuex";

export default {
  name: "student",
  components: {
    StudentListImport: () =>
      import(
        /* webpackChunkName: "studentListImport" */ "./components/StudentListImport"
      ),
    StudentDetailLog: () =>
      import(
        /* webpackChunkName: "studentDetailLog" */ "./components/StudentDetailLog"
      ),
    StudentListExport: () =>
      import(
        /* webpackChunkName: "studentListExport" */ "./components/StudentListExport"
      ),
    StudentList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "student",
      showExportLog: false
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
    switchExportLog() {
      this.showExportLog = !this.showExportLog;
    },
    openDetailLog(id) {
      this.currentId = id;
      this.switchDetailLog();
    }
  }
};
</script>
