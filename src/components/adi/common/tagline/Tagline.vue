<template>
  <div class="comp-tagline">
    <a :href="source.link">
      <h1 :style="style">{{ source.name }}</h1>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiTagline',
  mixins: [compBaseMixin],
  methods: {},
  computed: {
    style() {
      return this.generateStyleString({
        'font-size': this.options.fontSize,
        'line-height': this.options.fontSize,
        color: this.options.fontColor,
        margin: 0
        // 'margin-top': parseInt(this.options.fontSize) / 2 + 'px'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
