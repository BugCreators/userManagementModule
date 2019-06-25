<template>
  <img
    :src="imageUri"
    :class="className"
    @error="imageError"
    @load="showImage"
    v-show="showImageToggle"
    alt
  />
</template>
<script>
export default {
  name: "avueImage",
  data() {
    return {
      showImageToggle: false,
      imageUri: ""
    };
  },
  props: {
    srcImage: {
      type: String,
      required: true
    },
    replaceImage: {
      type: String,
      required: true
    },
    className: {
      type: Array,
      default: function() {
        return [""];
      }
    }
  },
  watch: {
    // eslint-disable-next-line
    srcImage: function(newV, oldV) {
      this.imageUri = newV || this.replaceImage;
    }
  },
  created() {
    this.imageUri = this.srcImage;
  },
  methods: {
    imageError() {
      this.imageUri = this.replaceImage;
    },
    showImage() {
      this.showImageToggle = true;
    }
  }
};
</script>
