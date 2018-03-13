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
      return Media.isImage(this.data.src)
    },
    isVideo() {
      return Media.isVideo(this.data.src)
    },
    hasMedia() {
      return this.data.src && this.data.src !== ''
    },
    src() {
      return this.data.src
    },
    link() {
      return this.data.link
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

