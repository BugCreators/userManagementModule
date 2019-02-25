<template>
  <div>
    <ListWarp
      :addFuncName="'openlog'"
      :amount="listAmount"
      :delFuncName="'collegesdel'"
      @collegesdel="collegesdel"
      @openlog="openlog"
    />
    <CollegesList
      ref="colleges-list"
      @openlog="openlog"
      @listamount="listamount"
    />
    <CollegeDetailLog v-if="showLog" :collegeId="currentCollegeId" />
  </div>
</template>

<script>
import CollegesList from "./components/CollegesList";
import ListWarp from "./../components/ListWarp";

export default {
  name: "college",
  components: {
    CollegeDetailLog: () =>
      import(/* webpackChunkName: "collegeDetailLog" */ "./components/CollegeDetailLog"),
    CollegesList,
    ListWarp
  },
  data() {
    return {
      currentCollegeId: undefined,
      listAmount: 0
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
    showLog() {
      return this.$store.state.showLog;
    }
  },
  created() {},
  methods: {
    listamount(amount) {
      this.listAmount = amount;
    },
    collegesdel() {
      this.$refs["colleges-list"].collegesdel(this.selectedCollegeId);
    },
    openlog(collegeId) {
      this.currentCollegeId = collegeId;
      this.$store.commit("switchShowLog");
    }
  }
};
</script>
