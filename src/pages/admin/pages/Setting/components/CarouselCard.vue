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
        :disabled="disabled"
      ></el-input>
      <div class="editButton" v-if="disabled">
        <el-button type="text" @click="switchDisabled">修改</el-button>
      </div>
      <div class="editButton" v-else>
        <el-button type="text" @click="changeInfo('website')">确定</el-button>
        <el-button type="text" @click="switchDisabled(true)">取消</el-button>
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
import { mapState, mapActions } from "vuex";

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
      disabled: true,
      initHref: ""
    };
  },
  created() {
    this.initHref = this.item.href;
  },
  computed: {
    ...mapState({
      token: state => state.userInfo.token
    })
  },
  methods: {
    ...mapActions(["getItems"]),
    openLog(index) {
      this.$emit("openLog", index);
    },
    deleteItemConfirm() {
      MessageBox.confirm(`确认删除该图片？`, `确认删除`, {
        type: "warning",
        callback: action => {
          switch (action) {
            case "confirm":
              this.deleteItem();
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
      let loading = Loading.service();
      this.getItems({
        url: this.$store.state.deleteCarouselItem,
        query: {
          index: this.item.index,
          token: this.token
        },
        cb: res => {
          loading.close();
          if (res.code === 200) {
            Message.success(res.msg);
            this.$emit("settingChange");
          } else {
            Message.error(res.msg);
          }
        }
      });
    },
    switchDisabled(isCancel) {
      if (isCancel) {
        this.item.href = this.initHref;
      }
      this.disabled = !this.disabled;
    },
    changeInfo() {
      if (this.initHref !== this.item.href) {
        this.getItems({
          url: this.$store.state.changeCarouselItemWebsite,
          query: {
            index: this.item.index,
            website: this.item.href,
            token: this.$store.state.userInfo.token
          },
          cb: res => {
            if (res.code === 200) {
              Message.success(res.msg);
              this.switchDisabled();
            } else {
              Message.error(res.msg);
            }
          }
        });
      } else {
        this.switchDisabled();
      }
    }
  }
};
</script>

<style lang="less" scope>
.carouselHref {
  width: 65% !important;
}
.carouselImage {
  height: 200px;
  width: 100%;
}
</style>
