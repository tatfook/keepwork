<template>
  <div class="form-preview">
    <div class="form-preview-header">
      <h1>{{title}}</h1>
      <p>{{description}}</p>
    </div>
    <div v-if="type == 3" class="form-preview-content">
      <quizzes-content :originQuizzes="quizzes" :isEditMode="false"></quizzes-content>
    </div>
    <div v-else class="form-preview-content" v-html="text"></div>
  </div>
</template>
<script>
import QuizzesContent from './QuizzesContent'
export default {
  name: 'FormPreview',
  props: {
    type: Number,
    title: String,
    description: String,
    text: String,
    quizzes: Array
  },
  components: {
    QuizzesContent
  }
}
</script>
<style lang="scss" scoped>
.form-preview {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  &-header {
    background-color: #2397f3;
    height: 116px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    h1 {
      font-size: 24px;
      color: #fff;
      margin: 0;
      font-weight: normal;
    }
    p {
      font-size: 14px;
      color: #5bf5ff;
      width: 468px;
      max-width: 100%;
      text-align: center;
      margin: 8px 0 0 0;
    }
  }
  &-content {
    padding: 32px 56px;
  }
}
</style>
