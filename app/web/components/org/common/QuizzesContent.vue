<template>
  <div class="quizzes-content" v-loading="isLoading">
    <div class="quizzes-content-item" v-for="(quiz, index) in quizzes" :key="index">
      <div class="quizzes-content-title">
        <span v-if="quiz.isRequired" class="quizzes-content-required">(必填)</span>
        {{quiz.title}}
        <el-dropdown v-if="isEditMode" trigger="click" @command="handleDropdownCommand">
          <span class="el-dropdown-link">
            <i class="iconfont icon-ellipsis"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{key: 'prev', quiz, index}">在前添加</el-dropdown-item>
            <el-dropdown-item :command="{key: 'next', quiz, index}">在后添加</el-dropdown-item>
            <el-dropdown-item :command="{key: 'edit', quiz, index}">编辑</el-dropdown-item>
            <el-dropdown-item :command="{key: 'delete', quiz, index}">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="quizzes-content-remark">{{quiz.remark}}</div>
      <el-radio-group v-if="quiz.type === 0" v-model="quiz.answer">
        <el-radio v-for="(option, index) in quiz.options" :key="index" :label="option.value" :disabled="isEditMode"></el-radio>
      </el-radio-group>
      <el-checkbox-group v-else-if="quiz.type === 1" v-model="quiz.answer">
        <el-checkbox v-for="(option, index) in quiz.options" :key="index" :label="option.value" :disabled="isEditMode"></el-checkbox>
      </el-checkbox-group>
      <el-input v-else type="textarea" :disabled="isEditMode" v-model="quiz.answer"></el-input>
    </div>
    <div v-if="isEditMode" class="quizzes-content-add" @click="showQuizEditor">
      <i class="iconfont icon-add--"></i>添加信息项
    </div>
    <div class="quizzes-content-answer">
      <el-button v-if="isAnswerMode" type="primary" size="medium" :disabled="!isFormDataValid" @click="submitFomData">我已填好，提交</el-button>
    </div>
    <quiz-editor :originQuiz="editingQuiz" :isVisible="isDialogVisible" @close="handleQuizEditorClose"></quiz-editor>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import QuizEditor from '../admin/common/QuizEditor'
export default {
  name: 'QuizzesContent',
  props: {
    originQuizzes: Array,
    isAnswerMode: {
      type: Boolean,
      default: false
    },
    isEditMode: {
      type: Boolean,
      default: true
    }
  },
  mounted() {
    let formQuizzes = _.cloneDeep(this.formQuizzes)
    this.quizzes = this.isAnswerMode
      ? _.map(formQuizzes, quiz => {
          let { type } = quiz
          return {
            ...quiz,
            answer: type != 2 ? quiz.options[0].value : ''
          }
        })
      : this.isEditMode
      ? formQuizzes
      : this.originQuizzes
  },
  computed: {
    ...mapGetters({
      getFormDetailById: 'org/getFormDetailById'
    }),
    formId() {
      return _.get(this.$route, 'params.id')
    },
    formDetail() {
      return this.getFormDetailById({ id: this.formId }) || {}
    },
    formQuizzes() {
      return _.get(this.formDetail, 'quizzes', [])
    },
    unAnsweredQuizzes() {
      return (
        _.filter(this.quizzes, quiz =>
          Boolean(quiz.isRequired && !_.trim(quiz.answer, ' '))
        ) || []
      )
    },
    isFormDataValid() {
      return this.unAnsweredQuizzes.length == 0
    }
  },
  data() {
    return {
      isLoading: false,
      insertIndex: undefined,
      editingQuiz: undefined,
      isDialogVisible: false,
      quizzes: []
    }
  },
  methods: {
    ...mapActions({
      orgSubmitForm: 'org/submitForm'
    }),
    showQuizEditor() {
      this.isDialogVisible = true
    },
    handleQuizEditorClose(quiz) {
      this.isDialogVisible = false
      let insertIndex = _.isNumber(this.insertIndex)
        ? this.insertIndex
        : this.quizzes.length
      this.insertIndex = undefined
      if (!quiz) {
        this.editingQuiz = undefined
        return
      }
      if (!this.editingQuiz) {
        this.quizzes.splice(insertIndex, 0, quiz)
        return
      }
      let { index } = this.editingQuiz
      this.quizzes[index] = quiz
      this.editingQuiz = undefined
    },
    editQuiz(quiz, index) {
      this.editingQuiz = {
        ...quiz,
        index
      }
      this.isDialogVisible = true
    },
    deleteQuiz(index) {
      this.quizzes.splice(index, 1)
    },
    handleDropdownCommand(command) {
      let { key, quiz, index } = command
      switch (key) {
        case 'edit':
          this.editQuiz(quiz, index)
          break
        case 'prev':
          this.showQuizEditor()
          this.insertIndex = index
          break
        case 'next':
          this.showQuizEditor()
          this.insertIndex = index + 1
          break
        case 'delete':
          this.deleteQuiz(index)
          break
        default:
          break
      }
      this.$emit('change')
    },
    async submitFomData() {
      this.isLoading = true
      await this.orgSubmitForm({
        formId: this.formId,
        quizzes: this.quizzes
      })
      this.isLoading = false
      this.$message({
        type: 'success',
        message: '提交成功'
      })
      this.$router.push({ name: 'OrgLogin' })
    }
  },
  components: {
    QuizEditor
  }
}
</script>
<style lang="scss" scoped>
.quizzes-content {
  font-size: 14px;
  &-item {
    border-radius: 8px;
    background-color: #fff;
    margin-bottom: 12px;
    padding: 12px;
  }
  &-title {
    margin-bottom: 10px;
    position: relative;
  }
  &-required {
    color: #e21b45;
  }
  &-remark {
    font-size: 12px;
    color: #c0c4cc;
    margin-bottom: 16px;
  }
  &-add {
    color: #2397f3;
    cursor: pointer;
    .icon-add-- {
      font-size: 22px;
      vertical-align: middle;
      margin-right: 6px;
    }
  }
  &-answer {
    text-align: center;
  }
  /deep/.el-textarea__inner {
    resize: none;
    height: 100px;
  }
  .el-dropdown {
    position: absolute;
    right: 0;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>
