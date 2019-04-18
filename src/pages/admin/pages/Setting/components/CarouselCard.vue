<template>
  <el-card>
    <div slot="header">
      <span>{{ item.name }}</span>
      <div class="cardButton">
        <el-button type="text" @click="openLog(item.index)">编辑图片</el-button>
        <el-button type="text" @click="deleteItemConfirm">删除</el-button>
      </div>
    </div>
    <div>
      链接：
      <el-input
        v-model="item.href"
        class="carouselHref"
        :disabled="disabledWebsite"
      ></el-input>
      <div class="editButton">
        <div v-if="disabledWebsite">
          <span @click="changeDisabledWebsite">修改</span>
        </div>
        <div v-else>
          <span @click="changeInfo('website')">确定</span>
          <span @click="changeDisabledWebsite">取消</span>
        </div>
      </div>
    </div>
    <div>
      图片：
      <AvueImage
        :class="'carouselImage'"
        :srcImage="item.url"
        :replaceImage="$store.state.defaultBanner"
      />
    </div>
  </el-card>
</template>

<script>
import { Card, Loading, Message, MessageBox } from "element-ui";
import AvueImage from "@/components/AvueImage";

export default {
  name: "carouseCard",
  components: {
    AvueImage,
    elCard: Card
  },
  props: {
    item: Object
  },
  data() {
    return {
      disabledWebsite: true
    };
  },
  methods: {
    openLog(index) {
      this.$emit("openLog", index);
    },
    deleteItemConfirm() {
      let that = this;
      MessageBox.confirm(`确认删除该图片？`, `确认删除`, {
        type: "warning",
        callback(action) {
          switch (action) {
            case "confirm":
              that.deleteItem();
              break;
            case "cancel":
            case "close":
              Message.info(`取消删除`);
              break;
          }
        }
      });
    },
    deleteItem() {
      let that = this;
      let loading = Loading.service();
      this.$store.dispatch("getItems", {
        url: this.$store.state.deleteCarouselItem,
        query: {
          index: this.item.index,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          loading.close();
          if (res.code === 200) {
            Message.success(res.msg);
            that.$emit("carouselChange");
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    changeDisabledWebsite() {
      this.disabledWebsite = !this.disabledWebsite;
    },
    changeInfo() {
      let that = this;
      this.$store.dispatch("getItems", {
        url: this.$store.state.changeCarouselItemWebsite,
        query: {
          index: this.item.index,
          website: this.item.href,
          token: this.$store.state.userInfo.token
        },
        cb(res) {
          if (res.code === 200) {
            Message.success(res.msg);
            that.changeDisabledWebsite();
          } else {
            Message.error(res.msg);
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scope>
.carouselHref {
  width: 65% !important;
}
.cardButton {
  float: right;
}
.carouselImage {
  height: 200px;
  width: 100%;
}
</style>
