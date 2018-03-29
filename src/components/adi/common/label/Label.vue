<template>
  <div class='comp-label'>
    <a :target='properties.target' :href='properties.link'>
      <label> {{properties.text}} </label>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiLabel',
  mixins: [compBaseMixin]
}
</script>

<style lang="scss" scoped>
.comp-label {
  a {
    text-decoration: none;
  }
}
</style>
