<template>
  <div>
    <SearchBox :moduleName="moduleName" 
      :showSelect="true"
      :basisOfCollege="false"
      :basisOfModule="true" />
    <ListWarp
      :count="count"
      :showDeleted="false"
      :showAdd="false"
      :showImport="false"
      :showExport="false"
    />
    <AuthorityList @changeCount="changeCount" />
  </div>
</template>

<script>
import AuthorityList from "./components/AuthorityList";
import ListWarp from "./../components/ListWarp";
import SearchBox from "./../../components/SearchBox";

export default {
  name: "Authority",
  components: {
    AuthorityList,
    ListWarp,
    SearchBox
  },
  data() {
    return {
      count: 0,
      moduleName: "authority"
    };
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
    }
  }
};
</script>
