<template>
  <div class='comp-media'>
    <a :href='link'>
      <div v-if='isImage' class="img" :style="loadImg"></div>
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
      return Media.isImage(this.properties.src)
    },
    isVideo() {
      return Media.isVideo(this.properties.src)
    },
    hasMedia() {
      return this.properties.src && this.properties.src !== ''
    },
    src() {
      return this.properties.src
    },
    link() {
      return this.properties.link
    },
    loadImg() {
      return this.generateStyleString({
        'background-image': 'url(' + this.properties.src + ')'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-media {
  width: 100%;
  height: 100%;

  .img {
    width: 100%;
    height: 100%;
    background-position: center;
    background-size: cover;
  }
}
</style>
