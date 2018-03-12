<template>
  <div class="comp-business-name">
    <a :href="data.link">
      <h1 :style="style">{{ data.name }}</h1>
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
      console.log(this)
      return (
        'font-size:' +
        this.options.fontSize +
        ';color:' +
        this.options.fontColor
      )
    },
    data() {
      return JSON.parse(this.source.data)
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>

