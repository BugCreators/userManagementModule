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
import { Card, Loading, Message } from "element-ui";
import avueMsgBox from "@/components/avueMsgBox/avueMsgBox";
import AvueImage from "@/components/AvueImage/AvueImage";
import { mapState } from "vuex";

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
  computed: {
    ...mapState({
      token: state => state.userInfo.token
    })
  },
  created() {
    this.initHref = this.item.href;
  },
  methods: {
    openLog(index) {
      this.$emit("openLog", index);
    },
    deleteItemConfirm() {
      avueMsgBox({
        message: "确认删除该图片？"
      })
        .then(() => this.deleteItem())
        .catch(() => Message.info(`取消删除`));
    },
    async deleteItem() {
      const loading = Loading.service();
      const res = await this.$http.deleteCarouselItem({
        index: this.item.index,
        token: this.token
      });
      loading.close();
      if (res.code === 200) {
        Message.success(res.msg);
        this.$emit("settingChange");
      } else {
        Message.error(res.msg);
      }
    },
    switchDisabled(isCancel) {
      if (isCancel) {
        this.item.href = this.initHref;
      }
      this.disabled = !this.disabled;
    },
    async changeInfo() {
      if (this.initHref !== this.item.href) {
        const res = await this.$http.changeCarouselItemWebsite({
          index: this.item.index,
          website: this.item.href,
          token: this.token
        });
        if (res.code === 200) {
          Message.success(res.msg);
          this.switchDisabled();
        } else {
          Message.error(res.msg);
        }
      } else {
        this.switchDisabled();
      }
    }
  }
};
</script>

<style lang="less" src="./CarouselCard.less" scope></style>
