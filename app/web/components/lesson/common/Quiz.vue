<template>
  <div class="quiz-container" :class="{'is-preview': isPreview}" :id="key">
    <!-- <div class="splic"></div> -->
    <div class="quiz-no-wrap">
      <i class="quiz-icon"></i>
      <span class="quiz-no">
        {{$t('card.quiz')}}
      </span>
      <span v-if="isMutipleChoice" class="mutiple-choice-tips">({{$t('card.multipleChoices')}})</span>
    </div>
    <div class="question">{{ question }}
    </div>

    <el-radio-group class="quiz" v-if="isSingleChoice" v-model="quizAnswer">
      <div class="quiz-option" v-for="(item, index) in options" :key="index">
        <el-radio :disabled="isDone" :label="alphabet[index]">{{alphabet[index]}} {{item.item}}</el-radio>
      </div>
    </el-radio-group>

    <el-checkbox-group class="quiz" v-if="isMutipleChoice" v-model="quizMutipleAnswer">
      <div class="quiz-option" v-for="(item, index) in options" :key="index">
        <el-checkbox :disabled="isDone" :label="alphabet[index]">{{alphabet[index]}} {{item.item}}</el-checkbox>
      </div>
    </el-checkbox-group>

    <el-radio-group class="quiz" v-if="isTFNG" v-model="quizAnswer">
      <div class="quiz-option" v-for="(item, index) in options" :key="index">
        <el-radio :disabled="isDone" :label="alphabet[index]">{{$t(`card.${item.item}`)}}</el-radio>
      </div>
    </el-radio-group>

    <div v-if="isTextMatch" class="quiz-text-match">
      <div v-for="(item, index) in options" :key="index">
        <div>{{$t('modList.text')}} {{index+1}}</div>
        <pre>{{item.item}}</pre>
      </div>
      <el-input v-if="!isDone" type="textarea" maxlength="512" v-model="quizAnswer" :placeholder="$t('card.textMatchPlaceholder')"></el-input>
    </div>

    <div v-if="isDone" class="quiz-result" :class="{'error': isError}">
      <div v-if="isSingleChoice || isMutipleChoice || isTFNG" class="answer">
        {{$t('card.rightAnswerColon')}}
        <span v-if="isTFNG" :class="[isError ? 'error-highlight': 'highlight']">{{TFNGAnswer}}</span>
        <span v-else :class="[isError ? 'error-highlight': 'highlight']">{{answer}}</span>
      </div>
      <div v-if="isTextMatch" class="answer">
        {{$t('card.yourAnswerColon')}}
        <span :class="[isError ? 'error-highlight': 'highlight']">{{quizAnswer}}</span>
      </div>
      <div class="desc">
        {{$t('card.explanationColon')}}
        <span :class="['explan',isError ? 'error-highlight': 'highlight']">{{desc}}</span>
      </div>
    </div>
    <div v-if="isFormatError" class="is-format-error">{{$t('lesson.formatError')}}</div>
    <el-button v-if="!isDone && !isPreview" class="quiz-submit" size="small" type="primary" @click="checkAnswer">{{$t('card.submit')}}</el-button>
  </div>
</template>


<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import { lesson } from '@/api'
export default {
  name: 'Quiz',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    isPrint: {
      type: Boolean,
      default: false
    },
    isVisitor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      quizAnswer: '',
      quizMutipleAnswer: [],
      isError: false,
      isRight: false,
      isDone: false
    }
  },
  methods: {
    ...mapActions({
      doQuiz: 'lesson/student/doQuiz',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords',
      createLearnRecords: 'lesson/student/createLearnRecords',
      uploadSelfLearnRecords: 'lesson/student/uploadSelfLearnRecords',
      uploadVisitorLearnRecords: 'lesson/student/uploadVisitorLearnRecords',
      switchSummary: 'lesson/student/switchSummary'
    }),
    checkAnswer() {
      this.isSingleChoice && this.checkSingleChoice()
      this.isMutipleChoice && this.checkMutipleChoice()
      this.isTFNG && this.checkTFNG()
      this.isTextMatch && this.checkTextMatch()
    },
    checkSingleChoice() {
      if (!this.quizAnswer) {
        return this.$message.error(this.$t('card.pleaseSelectOne'))
      }
      let result = this.answer.some(item => item === this.quizAnswer)
      this.showResultAndSubmit(result, this.quizAnswer)
    },
    checkMutipleChoice() {
      if (this.quizMutipleAnswer.length < 1) {
        return this.$message.error(this.$t('card.pleaseSelectOne'))
      }
      let quizMutipleAnswer = [...this.quizMutipleAnswer].sort()
      let answer = [...this.answer].sort()
      let result = JSON.stringify(quizMutipleAnswer) === JSON.stringify(answer)
      this.showResultAndSubmit(result, quizMutipleAnswer)
    },
    checkTFNG() {
      // true or false
      if (!this.quizAnswer) {
        return this.$message.error(this.$t('card.pleaseSelectOne'))
      }
      let result = this.answer[0] === this.quizAnswer
      this.showResultAndSubmit(result, this.quizAnswer)
    },
    checkTextMatch() {
      let quizAnswer = this.quizAnswer.trim()
      if (!quizAnswer.trim()) {
        return this.$message.error(this.$t('card.pleaseInputAnswer'))
      }
      let result = this.answer.some(({ item }) => item.trim() === quizAnswer)
      this.showResultAndSubmit(result, quizAnswer)
    },
    showResultAndSubmit(result, answer) {
      this.isError = !result
      this.isRight = result
      this.isDone = true
      this.submit(result, answer)
    },
    async submit(result, answer) {
      this.doQuiz({ key: this.key, question: this.question, result, answer })
      if (this.isBeInClassroom) {
        let state = this.lessonIsDone ? 1 : 0
        return await this.uploadLearnRecords(state).catch(e => console.error(e))
      }
      // 一次只能自学一个页面
      if (!this.isVisitor) {
        let lastLearnRecords = await lesson.lessons
          .getLastLearnRecords()
          .catch(e => console.error(e))
        lastLearnRecords = _.get(lastLearnRecords, 'rows', [])
        if (
          lastLearnRecords.length > 0 &&
          this.learnRecordsId !== lastLearnRecords[0].id
        ) {
          return this.$router.push({ name: 'StudentCenter' })
        }
      }

      // FIXME: 这里应该改成从store里面去课程包和课程的id
      const { packageId, lessonId } = this.$route.params
      // 首次需要先创建学习记录
      // if (!this.learnRecordsId && !this.isVisitor) {
      //   await this.createLearnRecords({
      //     packageId: Number(packageId),
      //     lessonId: Number(lessonId)
      //   })
      // }
      this.isVisitor
        ? await this.uploadVisitorLearnRecords({
            packageId: Number(packageId),
            lessonId: Number(lessonId),
            state: this.lessonIsDone ? 1 : 0
          })
        : await this.uploadSelfLearnRecords({
            packageId: Number(packageId),
            lessonId: Number(lessonId),
            state: this.lessonIsDone ? 1 : 0
          })
    }
  },
  watch: {
    quizzes(quizzes) {
      let quiz = quizzes.find(
        ({
          data: {
            quiz: { data }
          }
        }) => data[0].id === this.key
      )
      if (quiz && quiz.state && quiz.state.answer) {
        this.isDone = true
        this.isError = !quiz.state.result
        this.isRight = quiz.state.result
        this.quizAnswer = quiz.state.answer
        this.quizMutipleAnswer = quiz.state.answer
      }
    }
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'lesson/student/lessonDetail',
      isBeInClassroom: 'lesson/student/isBeInClassroom',
      learnRecordsId: 'lesson/student/learnRecordsId',
      lessonIsDone: 'lesson/student/lessonIsDone'
    }),
    modList() {
      return this.lessonDetail.modList || []
    },
    quizzes() {
      return this.modList.filter(item => item.cmd === 'Quiz')
    },
    key() {
      return _.get(this.data, 'data.quiz.data[0].id')
    },
    quizData() {
      return _.get(this.data, 'data.quiz.data[0]')
    },
    question() {
      return _.get(this.quizData, 'title')
    },
    answer() {
      return this.isTextMatch ? this.options : _.get(this.quizData, 'answer')
    },
    TFNGAnswer() {
      if (this.answer[0] === 'A') {
        return this.$t('card.true')
      }
      if (this.answer[0] === 'B') {
        return this.$t('card.false')
      }
      return false
    },
    desc() {
      return _.get(this.quizData, 'desc')
    },
    options() {
      return _.get(this.quizData, 'options')
    },
    quizType() {
      return _.get(this.quizData, 'type', '0')
    },
    isSingleChoice() {
      return this.quizType === '0'
    },
    isMutipleChoice() {
      return this.quizType === '1'
    },
    isTFNG() {
      return this.quizType === '2'
    },
    isTextMatch() {
      return this.quizType === '3'
    },
    alphabet() {
      return Array.from({ length: 26 }, (i, index) =>
        String.fromCharCode(65 + index)
      )
    },
    isFormatError() {
      return _.isEmpty(this.data.data)
    }
  }
}
</script>

<style lang="scss">
.quiz-container {
  box-sizing: border-box;
  margin-top: 10px;
  padding: 10px 15px;
  font-size: 16px;
  border: 1px solid #fff;
  color: #4c4c4c;
  background: white;
  max-width: 1229px;
  margin: 0 auto;
  .is-format-error {
    color: #F56C6C;
    margin-left: 60px;
  }
  &.is-preview {
    .el-radio__input,
    .el-checkbox__inner,
    .el-textarea {
      display: none;
    }
    .el-radio__input.is-checked ~ .el-radio__label,
    .el-checkbox__input.is-checked ~ .el-checkbox__label {
      color: #606266;
      font-weight: normal;
    }

    .el-radio__input.is-disabled + span.el-radio__label,
    .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #606266;
      font-weight: normal;
    }
  }
  .quiz-no-wrap {
    display: flex;
    align-items: center;
    margin-top: 10px;
    i {
      color: #1982ff;
      display: inline-block;
      width: 41px;
      height: 38px;
      font-size: 22px;
      font-weight: 600;
      padding-right: 12px;
      background: url('../../../assets/lessonImg/editIcon.png') no-repeat center
        #fff;
    }
    .quiz-no {
      margin-left: 10px;
      display: inline-block;
      font-weight: 600;
      height: 38px;
    }
    .mutiple-choice-tips {
      margin-left: 10px;
      display: inline-block;
      height: 38px;
    }
  }
  $marginLeft: 60px;
  $marginTop: 20px;
  .question {
    margin-left: $marginLeft;
    margin-top: $marginTop;
    white-space: normal;
    word-wrap: break-word;
  }
  .quiz {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-weight: 600;
    &-option {
      margin-top: $marginTop;
      font-size: 18px;
      margin-left: $marginLeft;
    }
  }
  .quiz-text-match {
    padding: 20px 40px 0;
    user-select: none;
    pre {
      white-space: pre-line;
    }
  }
  .quiz-result {
    margin-left: 20px;
    margin-top: $marginTop;
    background: rgba(64, 158, 254, 0.05);
    padding: 10px 20px;
    .desc,
    .answer {
      font-weight: 600;
      margin: 20px;
    }
    .highlight {
      color: #409efe;
    }
    .explan {
      word-break: break-all;
    }
  }
  .quiz-submit {
    margin-top: $marginTop;
    margin-left: $marginLeft;
  }
  .el-checkbox__inner {
    // border-radius: 50%;
    height: 20px;
    width: 20px;
    &::after {
      // border: 2px solid #fff;
      border-width: 2px;
      height: 11px;
      width: 5px;
      left: 5px;
    }
  }

  .el-radio__input {
    .el-radio__inner {
      height: 20px;
      width: 20px;
    }
    &.is-checked .el-radio__inner {
      &::after {
        box-sizing: content-box;
        display: inline-block;
        content: '';
        border: 2px solid #fff;
        background: none;
        border-radius: 0;
        border-left: 0;
        border-top: 0;
        height: 11px;
        width: 5px;
        left: 3px;
        position: absolute;
        top: 8px;
        transform: rotate(45deg) translate(-50%, -50%) scale(1);
      }
    }
    &.is-checked.is-disabled .el-radio__inner {
      &::after {
        border-color: #c0c4cc;
      }
    }
  }

  .el-radio__input.is-checked ~ .el-radio__label,
  .el-checkbox__input.is-checked ~ .el-checkbox__label {
    font-weight: 600;
    color: black;
  }

  .el-radio__input.is-disabled + span.el-radio__label,
  .el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: black;
  }

  .splic {
    height: 1px;
    margin: 0 0 30px 40px;
    border-bottom: 1px dashed #bfbfbf;
  }

  .error-highlight {
    color: #f53838;
  }

  .mutiple-choice-tips {
    color: #ff414a;
  }

  .error {
    margin-bottom: 20px;
    border: 1px solid #f53838;
    background: rgba(245, 56, 56, 0.05);
    .quiz-result {
      background: none;
    }
  }
}
</style>

