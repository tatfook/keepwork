<template>
  <div class="comp-lesson-get">
    <pre class="content">{{properties.content ? properties.content : $t(options.content)}}</pre>
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
  [data-mod="ModLessonGet"]{
    padding-top: 0;
    padding-bottom: 0;
  }

  .comp-lesson-get {
    margin: 25px 40px;
  }

  .comp-lesson-get .content {
    margin-top:25px;
    font-size: 16px;
    color:#333;
    font-family: inherit;
    word-wrap: break-word;
    white-space: pre-wrap;
  }

</style>
