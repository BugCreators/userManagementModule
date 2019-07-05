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
    <MajorList
      ref="list"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <MajorListImport @listChange="listChange" v-if="showImportLog" />
    <MajorDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox/SearchBox";
import ListWarp from "./../components/ListWarp/ListWarp";
import MajorList from "./components/MajorList";
import { mapState, mapMutations } from "vuex";

export default {
  name: "major",
  components: {
    MajorListImport: () =>
      import(/* webpackChunkName: "majorListImport" */ "./components/MajorListImport"),
    MajorDetailLog: () =>
      import(/* webpackChunkName: "majorDetailLog" */ "./components/MajorDetailLog"),
    MajorList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "major",
      addFuncName: "openDetailLog",
      delFuncName: "datasDeleteConfirm",
      exportFuncName: "listExportConfirm"
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
