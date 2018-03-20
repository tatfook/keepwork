<template>
  <div class="comp-button">
    <a :href="source.link" :style="style">
      {{source.name}}
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
export default {
  name: 'AdiButton',
  mixins: [compBaseMixin],
  methods: {},
  computed: {
    style() {
      return this.generateStyleString({
        'font-size': this.options.fontSize,
        color: this.options.fontColor,
        'background-color': this.options.bgColor
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-button {
  height: 100%;
  a {
    text-decoration: none;
  }
}
</style>