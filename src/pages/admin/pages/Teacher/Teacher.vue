<template>
  <div>
    <SearchBox :moduleName="moduleName" />
    <ListWarp
      :count="count"
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
import SearchBox from "./../../components/SearchBox/SearchBox";
import ListWarp from "./../components/ListWarp/ListWarp";
import TeacherList from "./components/TeacherList";
import { mapState, mapMutations } from "vuex";

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
      moduleName: "teacher"
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
