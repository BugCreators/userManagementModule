<template>
  <div id="content">
    <AvueHeader />
    <LoginFrame />
    <AvueFooter />
  </div>
</template>

<script>
import AvueHeader from "@/components/AvueHeader";
import LoginFrame from "./components/LoginFrame";
import AvueFooter from "@/components/AvueFooter";

export default {
  name: "login",
  components: {
    AvueHeader,
    LoginFrame,
    AvueFooter
  },
  created() {
    document.cookie = "avueUser=11111111111";
  }
};
</script>
