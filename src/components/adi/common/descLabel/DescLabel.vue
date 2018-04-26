<template>
  <div class='comp-label'>
    <a :target='properties.target ? properties.target : options.emptyTarget' :href='properties.link ? properties.link : options.emptyLink'>
      <label> {{properties.desc ? properties.desc : $t(options.emptyDesc)}} </label>
      <label> {{properties.text ? properties.text : $t(options.emptyText)}} </label>
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
    color: unset;
  }
}
</style>
