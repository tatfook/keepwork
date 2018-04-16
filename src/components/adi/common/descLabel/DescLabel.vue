<template>
  <div class='comp-label'>
    <a :target='properties.target' :href='properties.link'>
      <label> {{properties.desc ? properties.desc : options.emptyDesc}} </label>
      <label> {{properties.text ? properties.text : options.emptyText}} </label>
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
