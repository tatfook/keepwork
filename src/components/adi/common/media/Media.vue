<template>
  <div class='comp-media'>
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

<style lang="scss" scoped>
.comp-media {
  img {
    width: 100%;
  }
}
</style>

