<template>
  <div class="form-preview">
    <form-header :headerData="headerData" :isEditable="isEditable" />
    <div class="form-preview-content">
      <vue-draggable v-model="quizzesWithComp" @change="sortComps" :disabled="!isEditable">
        <component class="form-preview-item" :class="{'is-hoverable': isEditable}" v-for="(quizItem, index) in quizzesWithComp" :key="index" :is="quizItem.comp" :itemData="quizItem" :itemIndex="index" :isEditable="isEditable"></component>
      </vue-draggable>
    </div>
    <div class="form-preview-submit">
      <el-button type="primary">提交</el-button>
    </div>
  </div>
</template>
<script>
import VueDraggable from 'vuedraggable'
import { getCompByType } from './FormComps/compMap.sync'
import { mapGetters, mapActions } from 'vuex'
import FormHeader from './FormComps/FormHeader'
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
      editingForm: 'org/editingForm',
      editingFormQuizzes: 'org/editingFormQuizzes',
    }),
    quizzes() {
      return this.formDetail.quizzes || []
    },
    headerData() {
      return this.isEditable ? this.editingForm : this.formDetail
    },
  },
  methods: {
    ...mapActions({
      setEditingQuizzes: 'org/setEditingQuizzes',
    }),
    async setQuizzesWithComp() {
      const quizzes = this.isEditable ? this.editingFormQuizzes : this.quizzes
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
    sortComps() {
      this.setEditingQuizzes(_.map(this.quizzesWithComp, quiz => _.omit(quiz, 'comp')))
    },
  },
  watch: {
    formDetail: {
      deep: true,
      immediate: true,
      handler() {
        this.setQuizzesWithComp()
      },
    },
    editingFormQuizzes() {
      this.setQuizzesWithComp()
    },
  },
  components: {
    VueDraggable,
    FormHeader,
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
