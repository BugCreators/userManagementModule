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
      :showImport="false"
      :showExport="false"
      @datasDeleteConfirm="datasDelete"
      @openDetailLog="openDetailLog"
    />
    <RoleList
      ref="list"
      @openLogoLog="openLogoLog"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <RoleDetailLog
      v-if="showDetailLog"
      :dataId="currentId"
      @listChange="listChange"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox/SearchBox";
import ListWarp from "./../components/ListWarp/ListWarp";
import RoleList from "./components/RoleList";
import { mapState, mapMutations } from "vuex";

export default {
  name: "role",
  components: {
    RoleDetailLog: () =>
      import(/* webpackChunkName: "roleDetailLog" */ "./components/RoleDetailLog"),
    RoleList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentId: undefined,
      moduleName: "role"
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
