<template>
  <div class="comp-button">
    <a :href="data.link">
      <button :style="style"> {{data.text}} </button>
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
        margin: 0
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-button {
  height: 100%;
  a {
    height: 100%;
    button {
      border: none;
      height: 100%;
      // line-height: 20px;
    }
  }
}
</style>