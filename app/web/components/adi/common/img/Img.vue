<template>
  <div class="comp-img">
    <a :target='target' :href='link'>
      <img :src="getSrc" />
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiImg',
  mixins: [compBaseMixin],
  computed: {
    target() {
      return this.properties.target
        ? this.properties.target
        : this.options.emptyLinkTarget
    },
    link() {
      return this.properties.link
        ? this.properties.link
        : this.options.emptyLink
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
  }
}
</script>

<style lang="scss" scoped>
  .comp-img {
    img {
      width: 100%;
    }
  }
</style>