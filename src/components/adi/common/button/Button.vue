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
    display: inline-block;
    cursor: pointer;
    white-space: nowrap;
    padding: 6px 12px;
    border-radius: 4px;
    -ms-touch-action: manipulation;
    touch-action: manipulation;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
</style>