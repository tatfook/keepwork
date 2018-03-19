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
<<<<<<< HEAD
      return this.generateStyleString({
        'font-size': this.options.fontSize,
        color: this.options.fontColor,
        margin: 0
      })
    },
    data() {
      return JSON.parse(this.source.data)
=======
      return (
        'font-size:' +
        this.options.fontSize +
        ';line-height:' +
        parseInt(this.options.fontSize) / 2 +
        'px' +
        ';color:' +
        this.options.fontColor
      )
>>>>>>> 4f2f857... Update basic component, always use json data directly, DO NOT use json string!!!
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
