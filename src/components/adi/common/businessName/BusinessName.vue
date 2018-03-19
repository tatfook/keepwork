<template>
  <div class="comp-business-name">
    <a :href="source.link">
      <h1 :style="style">{{ source.name }}</h1>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiBussinessName',
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
a {
  text-decoration: none;
}
</style>

