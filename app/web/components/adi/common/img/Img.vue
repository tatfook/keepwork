<template>
  <div class="comp-img">
    <img :src="getSrc" />
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiImg',
  mixins: [compBaseMixin],
  computed: {
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