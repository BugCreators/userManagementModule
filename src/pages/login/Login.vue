<template>
  <div id="content">
    <AvueHeader />
    <LoginFrame />
    <AvueFooter />
  </div>
</template>

<script>
import AvueHeader from "@/components/AvueHeader/AvueHeader";
import LoginFrame from "./components/LoginFrame/LoginFrame";
import AvueFooter from "@/components/AvueFooter/AvueFooter";

export default {
  name: "login",
  components: {
    AvueHeader,
    LoginFrame,
    AvueFooter
  }
};
</script>
