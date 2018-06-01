<template>
  <iframe class='comp-iframe' :id='properties.id' :src='properties.src' :width='properties.width' :height='properties.height' />
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
export default {
  name: 'AdiIFrame',
  mixins: [compBaseMixin]
}
</script>

<style scss>
.comp-iframe{
  min-height: 20px;
}
</style>
