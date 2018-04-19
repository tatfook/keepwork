<template>
  <div class='comp-label'>
    <a :target='properties.target ? properties.target : options.emptyTarget' :href='properties.link ? properties.link : options.emptyLink'>
      <label> {{properties.text ? properties.text : options.emptyText }} </label>
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
    color: unset;
  }
}
</style>
