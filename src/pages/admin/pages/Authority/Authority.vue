<template>
  <div>
    <SearchBox
      :moduleName="moduleName"
      :showSelect="true"
      :basisOfCollege="false"
      :basisOfModule="true"
    />
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
import ListWarp from "./../components/ListWarp/ListWarp";
import SearchBox from "./../../components/SearchBox/SearchBox";
import { mapMutations } from "vuex";

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
    this.setSearchValue({
      basis: 0,
      name: ""
    });
  },
  methods: {
    ...mapMutations(["setSearchValue"]),
    changeCount(count) {
      this.count = count;
    }
  }
};
</script>
