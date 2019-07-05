<template>
  <div>
    <SearchBox
      :moduleName="moduleName"
      :showSelect="true"
      :basisOfCollege="false"
      :basisOfBranch="true"
      :basisOfRole="true"
    />
    <ListWarp
      :count="count"
      :moduleName="moduleName"
      :showImport="false"
      :showExport="false"
      @datasDeleteConfirm="datasDelete"
      @openDetailLog="openDetailLog"
    />
    <AdministratorList
      ref="list"
      @openLogoLog="openLogoLog"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <AdministratorDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox/SearchBox";
import AdministratorList from "./components/AdministratorList";
import ListWarp from "./../components/ListWarp/ListWarp";
import { mapState, mapMutations } from "vuex";

export default {
  name: "administrator",
  components: {
    AdministratorDetailLog: () =>
      import(/* webpackChunkName: "administratorDetailLog" */ "./components/AdministratorDetailLog"),
    AdministratorList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "administrator"
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
    openDetailLog(id) {
      this.currentId = id;
      this.switchDetailLog();
    }
  }
};
</script>
