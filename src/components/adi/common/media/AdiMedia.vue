<template>
  <div v-if='editorMode' @click.stop.prevent='editProperty' class='kp-media' :class='{active: isActive}'>
    <a v-if='hasMedia'>
      <img v-if='isImage' :src='media.src'>
      <video v-else-if='isVideo' :src='media.src'></video>
    </a>
    <a v-else>
      <img src="@/assets/logo.svg">
    </a>
  </div>
  <div v-else class='kp-media'>
    <a :href='media.link'>
      <img v-if='isImage' :src='media.src'>
      <video v-else-if='isVideo' :src='media.src'></video>
    </a>
  </div>
</template>

<script>
import Media from './media.types'

export default {
  name: 'AdiMedia',
  props: {
    media: {
      type: Object,
      required: true
    },
    editorMode: {
      type: Boolean,
      default: false
    },
    property: String,
    isActive: Boolean
  },
  computed: {
    isImage() {
      return Media.isImage(this.media.src)
    },
    isVideo() {
      return Media.isVideo(this.media.src)
    },
    hasMedia() {
      return this.media.src && this.media.src !== ''
    }
  },
  methods: {
    editProperty() {
      this.$emit('editProperty', this.property)
    }
  }
}
</script>

<style lang='scss' scoped>
.kp-media {
  a {
    width: 100%;
    height: 100%;
  }
  &.active {
    border: 1px solid rgb(199, 27, 27);
  }
}
</style>
