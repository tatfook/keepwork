<template>
  <div class='comp-label'>
    <a :target='properties.target' :href='properties.link'>
      <label> {{properties.desc}} </label>
      <label> {{properties.text}} </label>
    </a>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiDescLabel',
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
