<template>
  <div>
    <SearchBox :moduleName="moduleName" />
    <ListWarp
      :addFuncName="'openDetailLog'"
      :amount="amountOfData"
      :delFuncName="'collegesdel'"
      :moduleName="moduleName"
      @collegesdel="collegesdel"
      @openDetailLog="opendetaillog"
    />
    <CollegeList
      ref="colleges-list"
      @openDetailLog="opendetaillog"
      @amountOfData="amountofdata"
    />
    <CollegeBatchImport v-if="showImportLog" />
    <CollegeDetailLog v-if="showDetailLog" :collegeId="currentCollegeId" />
  </div>
</template>

<script>
import SearchBox from "./../../components/SearchBox";
import CollegeList from "./components/CollegeList";
import ListWarp from "./../components/ListWarp";

export default {
  name: "college",
  components: {
    CollegeBatchImport: () =>
      import(/* webpackChunkName: "collegeBatchImport" */ "./components/CollegeBatchImport"),
    CollegeDetailLog: () =>
      import(/* webpackChunkName: "collegeDetailLog" */ "./components/CollegeDetailLog"),
    CollegeList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      amountOfData: 0,
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
  created() {},
  methods: {
    amountofdata(amount) {
      this.amountOfData = amount;
    },
    collegesdel() {
      this.$refs["colleges-list"].collegesdel(this.selectedCollegeId);
    },
    opendetaillog(collegeId) {
      this.currentCollegeId = collegeId;
      this.$store.commit("switchDetailLog");
    }
  }
};
</script>
