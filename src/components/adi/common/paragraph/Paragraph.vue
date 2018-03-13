<template>
    <div class="comp-paragraph">
        <p>{{ data.content }}</p>
    </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiParagraph',
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
