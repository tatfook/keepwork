<template>
  <div class="hint-container">
    <div class="hint-title">{{$t('lesson.teachers')}}</div>
    <vue-markdown :source="content" />
  </div>
</template>


<script>
import VueMarkdown from 'vue-markdown'
export default {
  name: 'Hint',
  components: {
    VueMarkdown
  },
  data() {
    return {}
  },
  mounted() {},
  props: {
    data: Object
  },
  computed: {
    content() {
      return _.get(this.data, 'data.hint.data', '')
    }
  }
}
</script>


<style lang="scss">
.hint-container {
  max-width: 1229px;
  min-height: 100px;
  padding: 20px;
  margin: 0 auto;
  background: #fef6ef;
  box-sizing: border-box;
  .hint-title {
    color: #fd7a05;
    font-weight: 600;
    background: white;
    display: inline-block;
    height: 49px;
    line-height: 38px;
    text-align: center;
    width: 122px;
    background: url('../../../assets/lessonImg/teachers_pop.png') no-repeat
      center center;
  }
  .hint-content {
    white-space: normal;
    word-wrap: break-word;
    margin-top: 20px;
  }
}
</style>
