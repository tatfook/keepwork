<template>
  <div v-if='isHidden'></div>
  <div v-else-if='editorMode' @click.stop.prevent='editProperty' class='comp-label' :class='{active: isActive}'>
    <label> {{source.text}} </label>
  </div>
  <div v-else class='comp-label'>
    <a :href='source.link'>
      <label> {{source.text}} </label>
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

<style lang='scss' scoped>
.comp-label {
  &.active {
    border: 1px solid rgb(199, 27, 27);
  }
}
</style>
