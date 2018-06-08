<template>
  <div>
    <p v-for="(size, index) in fontSizeList[fontSizeIndex]" :style="{fontSize: `${size}px`, fontFamily: fontFamily}" :key="index">你好！ Hello!</p>
  </div>
</template>

<script>
export default {
  name: 'WebsiteSettingStyleFontPreview',
  props: {
    fontSizeIndex: {
      type: Number,
      default: 0
    },
    fontSizeList: {
      type: Array,
      default: []
    },
    fontFamily: {
      type: String,
      default: ''
    }
  }
}
</script>


