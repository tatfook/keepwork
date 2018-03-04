<template>
  <div v-if='isHidden'></div>
  <div v-else-if='editorMode' @click.stop.prevent='editProperty' class='comp-media' :class='{active: isActive}'>
    <a v-if='hasMedia'>
      <img v-if='isImage' :src='src'>
      <video v-else-if='isVideo' :src='src'></video>
    </a>
    <a v-else>
      <img src="@/assets/logo.svg">
    </a>
  </div>
  <div v-else class='comp-media'>
    <a :href='link'>
      <img v-if='isImage' :src='src'>
      <video v-else-if='isVideo' :src='src'></video>
    </a>
  </div>
</template>

<script>
import Media from './media.types'
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiMedia',
  mixins: [compBaseMixin],
  computed: {
    isImage() {
      return Media.isImage(this.source.src)
    },
    isVideo() {
      return Media.isVideo(this.source.src)
    },
    hasMedia() {
      return this.source.src && this.source.src !== ''
    },
    src() {
      return this.source.src
    },
    link() {
      return this.source.link
    }
  }
}
</script>

<style lang='scss' scoped>
.comp-media {
  &.active {
    border: 1px solid rgb(199, 27, 27);
  }
}
</style>
