<template>
  <div>
    <SearchBox :moduleName="moduleName" />
    <ListWarp
      :count="count"
      :showDeleted="false"
      :showAdd="false"
      :showImport="false"
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
  methods: {
    changeCount(count) {
      this.count = count;
    }
  }
};
</script>
