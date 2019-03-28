<template>
  <div class="lesson-student-progress">
    <span @mouseover="showProgressList" @mouseout="hideProgressList" class="progress-point start" @click="handleShowQuiz">
      <div :class="['progress-point-title', {'light': isQuizLight}]">{{$t('lesson.lessonPlan')}}</div>
      <div class="progress-point-number">{{lessonQuizDone}}/{{lessonQuizCount}}
        <div v-show="isShowQuizResult" class="quiz-result-list-wrap">
          <div class="quiz-result-list">
            <div class="quiz-result-list-container">
              <div v-for="(quiz, index) in lessonQuiz" :key="index" @click.stop="showMeTheQuiz(quiz.key)" :class="['quiz-status-wrap',{'default': quiz.result === null}]">
                <span class="quiz-number">{{$t('lesson.quiz2')}} {{index+1}}</span>
                <i class="el-icon-circle-check quiz-result right" v-if="quiz.result === true"></i>
                <i class="el-icon-circle-close quiz-result wrong" v-if="quiz.result === false"></i>
              </div>
              <el-button v-if="isShowRedo" :loading="redoLoading" @click="handleRedo" class="quiz-redo-button" round type="success">{{$t('lesson.learnAgain')}}</el-button>
            </div>
          </div>
        </div>
      </div>
    </span>
    <el-progress class="progress-line" :text-inside="true" :show-text="false" :stroke-width="18" :percentage="lessonQuizProgress" status="success"></el-progress>
    <span class="progress-point end" :class="[lessonIsDone ? 'finish' : 'grey']" @click.stop="handleShowSummary">
      <div :class="['progress-point-title',{'light': !this.isQuizLight}]">{{$t('lesson.summary')}}</div>
    </span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import scrollIntoView from 'scroll-into-view-if-needed'
export default {
  name: 'LessonStudentProgress',
  props: {
    progressNumer: {
      type: String,
      default: '0'
    },
    isVisitor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isShowQuizResult: false,
      quizList: [],
      redoLoading: false
    }
  },
  computed: {
    ...mapGetters({
      lessonQuiz: 'org/student/lessonQuiz',
      lessonQuizCount: 'org/student/lessonQuizCount',
      lessonQuizDone: 'org/student/lessonQuizDone',
      lessonQuizProgress: 'org/student/lessonQuizProgress',
      lessonIsDone: 'org/student/lessonIsDone',
      isShowSummary: 'org/student/isShowSummary',
      isQuizAllRight: 'org/student/isQuizAllRight',
      isBeInClassroom: 'org/student/isBeInClassroom'
    }),
    isQuizLight() {
      return !this.isShowSummary
    },
    isQuizAllDone() {
      return (
        this.lessonQuizDone > 0 && this.lessonQuizDone === this.lessonQuizCount
      )
    },
    isShowRedo() {
      return (
        !this.isVisitor &&
        !this.isBeInClassroom &&
        this.isQuizAllDone &&
        !this.isQuizAllRight
      )
    }
  },
  watch: {
    lessonIsDone(value) {
      if (value && !this.isQuizAllRight) {
        this.isShowQuizResult = true
      }
    }
  },
  methods: {
    ...mapActions({
      switchSummary: 'org/student/switchSummary'
    }),
    showMeTheQuiz(key) {
      let theQuiz = document.getElementById(key)
      theQuiz &&
        scrollIntoView(theQuiz, {
          scrollMod: 'if-needed',
          behavior: 'smooth'
        })
    },
    showProgressList() {
      if (this.isQuizLight) {
        this.isShowQuizResult = true
      }
    },
    hideProgressList() {
      if (this.isQuizLight) {
        this.isShowQuizResult = false
      }
    },
    handleShowSummary() {
      if (this.lessonIsDone) {
        this.switchSummary(true)
        this.isShowQuizResult = false
      }
    },
    handleShowQuiz() {
      this.switchSummary(false)
    },
    handleRedo() {
      this.redoLoading = true
      this.$router.go(0)
    }
  }
}
</script>


<style lang="scss">
.lesson-student-progress {
  $green: #66cd2e;
  $grey: #d2d2d2;
  background: #f8f8f8;
  display: flex;
  flex-direction: row;
  align-items: center;
  .progress-point {
    $size: 33px;
    display: inline-block;
    height: $size;
    width: $size;
    border-radius: 50%;
    background: $green;
    border: 3px solid white;
    box-shadow: 1px 3px 6px rgb(185, 185, 185);
    &.grey {
      $size: 33px;
      background: $grey;
      height: $size;
      width: $size;
      border: 3px solid white;
    }
    &.finish {
      cursor: pointer;
      background: $green;
    }
    &.start {
      position: relative;
      z-index: 9;
      margin-right: -25px;
      cursor: pointer;
      &.noStart {
        $size: 33px;
        height: $size;
        width: $size;
        border: 3px solid white;
        background: $grey;
      }
    }
    &.end {
      position: relative;
      margin-left: -25px;
      z-index: 9;
    }
    &-title {
      min-width: 100px;
      position: relative;
      margin-top: -25px;
      margin-left: -17px;
      color: #686868;
      &.light {
        color: #409efe;
      }
    }
    &-number {
      display: block;
      color: #686868;
      height: 40px;
      line-height: 40px;
      position: relative;
      top: 35px;
      cursor: pointer;
    }
  }
  .progress-line {
    flex: 1;
  }
  .el-progress-bar__outer {
    background-color: $grey;
  }
}

.quiz-result-list-wrap {
  position: relative;
  padding-top: 50px;
  top: -50px;
  width: 260px;
  left: -120px;
  z-index: 9;
  .quiz-result-list {
    $shadow: 1px 1px 25px #d0d0d0;
    box-shadow: $shadow;
    &-container {
      margin-top: 20px;
      width: 100%;
      box-sizing: border-box;
      background: white;
      z-index: 998;
      padding: 20px;
      position: relative;
      text-align: center;
      .quiz-redo-button {
        margin-top: 16px;
      }
      .quiz-status-wrap {
        height: 40px;
        border-radius: 30px;
        background: #409efe;
        color: white;
        font-weight: 600;
        margin: 10px auto;
        padding: 0 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 1px 1px 9px #e0e0e0;
        // &.quiz-redo-button {
        //   text-align: center;
        //   background: #67c23a;
        //   display: block;
        // }
        &.default {
          color: black;
          background: white;
        }
        .quiz-result {
          $size: 30px;
          font-size: $size;
          box-sizing: border-box;
          background: white;
          height: $size;
          width: $size;
          line-height: $size;
          border-radius: 50%;
          border: none;
          &.right {
            color: #1d72c9;
          }
          &.wrong {
            color: #fa5a7c;
          }
        }
      }
    }
    &::before {
      $size: 30px;
      content: '';
      display: block;
      height: $size;
      width: $size;
      background: white;
      z-index: 10;
      transform: rotate(45deg);
      position: absolute;
      left: 115px;
      top: 60px;
      box-shadow: $shadow;
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .lesson-student-progress {
    .progress-point {
      width: 16px;
      height: 16px;
      &.grey {
        width: 16px;
        height: 16px;
      }
    }
  }
}
</style>

