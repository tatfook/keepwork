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
  name: 'AdiSubtitle',
  mixins: [compBaseMixin],
  methods: {},
  computed: {
    style() {
      return (
        'font-size:' +
        this.options.fontSize +
        ';line-height:' +
        parseInt(this.options.fontSize) / 2 +
        'px' +
        ';color:' +
        this.options.fontColor
      )
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
