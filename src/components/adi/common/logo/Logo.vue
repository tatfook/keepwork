<template>
  <div class="comp-logo">
    <a :href="source.link">
      <div class="logo-img" :style="logoImg"></div>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiLogo',
  mixins: [compBaseMixin],
  methods: {},
  computed: {
    logoImg() {
      return this.generateStyleString({
        background: 'url(' + this.source.img + ')',
        'background-position': 'center',
        'background-size': 'cover'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-logo {
  width: 100%;
  height: 100%;

  .logo-img {
    width: 100%;
    height: 100%;
  }
}
</style>


