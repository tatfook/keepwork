<template>
  <div class="comp-teachers">
    <div>Teachers:</div>
    <div class="content"> {{properties.content ? properties.content : $t(options.content)}}</div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiTeachers',
  mixins: [compBaseMixin],
}
</script>

<style>
  .comp-teachers .content {
    margin-top:25px;
    font-size: 16px;
    color:#333;
  }
</style>
