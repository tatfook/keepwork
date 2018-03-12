<template>
  <div class="comp-logo">
    <a :href="data.link">
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
      return (
        `background: url('` +
        this.data.img +
        `');background-position: center;background-size: cover;`
      )
    },
    data() {
      return JSON.parse(this.source.data)
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


