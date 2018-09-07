<template>
  <div class="lesson-markdown-container">
    <div class="lesson-markdown-icon-wrap">
      <i class="lesson-markdown-icon"></i>
    </div>
    <vue-markdown :source="mdStr" />
  </div>
</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {
  name: 'LessonMarkdown',
  components: {
    VueMarkdown
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    mdStr() {
      return this.data.data.md.data
    },
    mdArr() {
      return this.data.md
    }
  }
}
</script>


<style lang="scss">
.lesson-markdown-container {
  padding: 10px 15px;
  max-width: 1229px;
  box-sizing: border-box;
  margin: 0 auto;
  background: white;
  display: flex;
  flex-direction: row;
  .lesson-markdown-icon-wrap {
    width: 100px;
    .lesson-markdown-icon {
      display: inline-block;
      height: 72px;
      width: 61px;
      background: url('../../../assets/lessonImg/markdown.png') no-repeat center
        #fff;
    }
  }
}
</style>


