<template>
  <div class="comp-img">
    <a :target='target' :href='link'>
      <div v-if='isImage'>
        <img :src="getSrc" />
      </div>
      <div v-else-if='isVideo'>
        <video v-if="updateDom" :src='getSrc' :autoplay="autoplay" :loop="playloop" :poster="poster" controls="controls"></video>
      </div>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import Media from '@/components/adi/common/media/media.types'
import { setTimeout } from 'timers';

export default {
  name: 'AdiImg',
  mixins: [compBaseMixin],
  data() {
    return {
      updateDom: true
    }
  },
  watch: {
    poster() {
      this.refresh()
    }
  },
  computed: {
    target() {
      return this.properties.target
        ? this.properties.target
        : this.options.target
    },
    link() {
      return this.properties.link
        ? this.properties.link
        : this.options.link
    },
    autoplay() {
      return this.properties.autoplay
        ? this.properties.autoplay
        : this.options.autoplay
    },
    playloop() {
      return this.properties.playloop
        ? this.properties.playloop
        : this.options.playloop
    },
    poster() {
      return this.properties.poster
        ? this.properties.poster
        : this.options.poster
    },
    isImage() {
      return Media.isImage(this.getSrc)
    },
    isVideo() {
      return Media.isVideo(this.getSrc)
    },
    getSrc() {
      if (!this.properties.src && !this.options.emptyMedia) {
        return ''
      }

      if (!this.properties.src) {
        return this.options.emptyMedia
      }

      return this.properties.src || ''
    }
  },
  methods: {
    refresh() {
      this.updateDom = false
      setTimeout(() => {this.updateDom = true}, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
  .comp-img {
    img {
      width: 100%;
      height: 100%;
    }
    video {
      width: 100%;
      height: 100%;
    }
  }
</style>