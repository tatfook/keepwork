<template>
  <div class="form-preview">
    <div class="form-preview-header">
      <h1 :title="title">{{title}}</h1>
      <p :title="description">{{description}}</p>
    </div>
    <div class="form-preview-content">
      <component class="form-preview-item" :class="{'is-hoverable': isEditable}" v-for="(quizItem, index) in quizzesWithComp" :key="index" :is="quizItem.comp" :itemData="quizItem" :itemIndex="index" :isEditable="isEditable"></component>
    </div>
    <div class="form-preview-submit">
      <el-button type="primary">提交</el-button>
    </div>
  </div>
</template>
<script>
import { getCompByType } from './FormComps/compMap.sync'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'FormPreview',
  props: {
    formDetail: {
      type: Object,
      default: {},
    },
    isAnswerMode: {
      type: Boolean,
      default: false,
    },
    isEditable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      quizzesWithComp: [],
    }
  },
  computed: {
    ...mapGetters({
      editingFormQuizzes: 'org/editingFormQuizzes',
    }),
    title() {
      return this.formDetail.title
    },
    description() {
      return this.formDetail.description
    },
    text() {
      return this.formDetail.text
    },
    quizzes() {
      return this.formDetail.quizzes || []
    },
  },
  methods: {
    ...mapActions({ setEditingQuizzes: 'org/setEditingQuizzes' }),
    async setQuizzesWithComp() {
      const quizzes = this.editingFormQuizzes
      let result = []
      for (let index = 0; index < quizzes.length; index++) {
        const element = quizzes[index]
        const { type } = element
        const data = await getCompByType(type)
        const compDefault = data.default
        result.push({
          ...element,
          answer: type == 0 ? element.options[0].value : type == 1 ? [] : '',
          comp: compDefault,
        })
      }
      this.quizzesWithComp = result
    },
  },
  watch: {
    quizzes: {
      immediate: true,
      handler(values) {
        this.setEditingQuizzes(values)
        this.setQuizzesWithComp()
      },
    },
    editingFormQuizzes() {
      this.setQuizzesWithComp()
    },
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
  &-item {
    font-size: 14px;
    padding: 0 40px;
    color: #303133;
    border: 1px dashed transparent;
    &.is-hoverable:hover {
      border-color: #ccc;
    }
  }
  &-content {
    padding: 12px 0 8px;
  }
  &-submit {
    text-align: center;
    padding: 20px 0;
    border-top: 1px solid #e8e8e8;
    .el-button {
      width: 100px;
      height: 32px;
      line-height: 32px;
      padding: 0;
    }
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
