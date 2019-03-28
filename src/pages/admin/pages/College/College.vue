<template>
  <div>
    <SearchBox :moduleName="moduleName" />
    <ListWarp
      :addFuncName="'openDetailLog'"
      :count="count"
      :delFuncName="'collegesDelConfirm'"
      :moduleName="moduleName"
      @collegesDelConfirm="collegesDel"
      @openDetailLog="openDetailLog"
    />
    <CollegeList
      ref="colleges-list"
      @openDetailLog="openDetailLog"
      @changeCount="changeCount"
    />
    <CollegeListImport
      @collegeListChange="collegeListChange"
      v-if="showImportLog"
    />
    <CollegeDetailLog
      v-if="showDetailLog"
      :collegeId="currentCollegeId"
      @collegeListChange="collegeListChange"
      @collegeChange="collegeChange"
    />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox";
import CollegeList from "./components/CollegeList";
import ListWarp from "./../components/ListWarp";

export default {
  name: "college",
  components: {
    CollegeListImport: () =>
      import(/* webpackChunkName: "collegeListImport" */ "./components/CollegeListImport"),
    CollegeDetailLog: () =>
      import(/* webpackChunkName: "collegeDetailLog" */ "./components/CollegeDetailLog"),
    CollegeList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      currentCollegeId: undefined,
      moduleName: "college"
    };
  },
  computed: {
    selectedCollegeId() {
      return this.$refs["colleges-list"].selectedCollegeId.map(
        (value, index, array) => {
          return {
            id: array[index]["id"]
          };
        }
      );
    },
    showDetailLog() {
      return this.$store.state.showDetailLog;
    },
    showImportLog() {
      return this.$store.state.showImportLog;
    }
  },
  methods: {
    changeCount(count) {
      this.count = count;
    },
    collegeListChange() {
      this.$refs["colleges-list"].getCollegeList();
    },
    collegeChange(data) {
      this.$refs["colleges-list"].collegeChange(data);
    },
    collegesDel() {
      this.$refs["colleges-list"].collegesDelConfirm(
        this.$refs["colleges-list"].selectedCollegeId
      );
    },
    openDetailLog(collegeId) {
      this.currentCollegeId = collegeId;
      this.$store.commit("switchDetailLog");
    }
  }
};
</script>
