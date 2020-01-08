<template>
  <div class="form-preview">
    <div class="form-preview-header">
      <h1 :title="title">{{title}}</h1>
      <p :title="description">{{description}}</p>
    </div>
    <div v-if="type == 3" class="form-preview-content">
      <quizzes-content :originQuizzes="quizzes" :isEditMode="false" :isAnswerMode="isAnswerMode"></quizzes-content>
    </div>
    <div v-else class="form-preview-content" v-html="text"></div>
  </div>
</template>
<script>
import QuizzesContent from '../common/QuizzesContent'
export default {
  name: 'FormPreview',
  props: {
    type: Number,
    title: String,
    description: String,
    text: String,
    quizzes: Array,
    isAnswerMode: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    QuizzesContent,
  },
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
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      max-width: 100%;
    }
    p {
      font-size: 14px;
      color: #5bf5ff;
      max-width: 468px;
      text-align: center;
      margin: 8px 0 0 0;
      line-clamp: 2;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
  }
  &-content {
    padding: 32px 56px;
  }
}
@media screen and (max-width: 768px) {
  .form-preview {
    border-radius: 0;
    &-header {
      padding: 16px;
      height: auto;
      h1 {
        white-space: initial;
      }
      p {
        display: initial;
        text-align: left;
        width: 100%;
      }
    }
    &-content {
      padding: 8px 16px 24px 16px;
      font-size: 14px;
    }
  }
}
</style>
