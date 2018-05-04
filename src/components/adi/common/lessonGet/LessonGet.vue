<template>
  <div class="comp-lesson-get">
    <pre class="content"> {{properties.content ? properties.content : $t(options.content)}}</pre>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'

export default {
  name: 'AdiLessonGet',
  mixins: [compBaseMixin],
}
</script>

<style>
  .comp-lesson-get .content {
    margin-top:25px;
    font-size: 16px;
    color:#333;
  }
</style>
