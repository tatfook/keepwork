<template>
  <div class="lesson-progress">
    <span @mouseover="showProgressList" @mouseout="hideProgressList" class="progress-point start" :class="{'noStart': lessonQuizDone === 0}">
      <div class="progress-point-number">{{lessonQuizDone}}/{{lessonQuizCount}}
        <div v-show="isShowQuizResult" class="quiz-result-list-wrap">
          <div class="quiz-result-list">
            <div class="quiz-result-list-container">
              <div v-for="(quiz, index) in lessonQuiz" :key="index" class="quiz-status-wrap" :class="{'default': quiz.result === null}">
                <span class="quiz-number">Quiz {{index+1}}</span>
                <span class="quiz-status" :class="{'right': quiz.result === true, 'wrong':quiz.result === false}"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </span>
    <el-progress class="progress-line" :text-inside="true" :show-text="false" :stroke-width="18" :percentage="lessonQuizProgress" status="success"></el-progress>
    <span class="progress-point end" :class="[lessonIsDone ? 'finish' : 'grey']"></span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'LessonProgress',
  props: {
    progressNumer: {
      type: String,
      default: '3/6'
    }
  },
  data() {
    return {
      isShowQuizResult: false,
      quizList: []
    }
  },
  computed: {
    ...mapGetters({
      lessonQuiz: 'lesson/student/lessonQuiz',
      lessonQuizCount: 'lesson/student/lessonQuizCount',
      lessonQuizDone: 'lesson/student/lessonQuizDone',
      lessonQuizProgress: 'lesson/student/lessonQuizProgress',
      lessonIsDone: 'lesson/student/lessonIsDone'
    })
  },
  methods: {
    showProgressList() {
      this.isShowQuizResult = true
    },
    hideProgressList() {
      this.isShowQuizResult = false
    }
  }
}
</script>


<style lang="scss">
.lesson-progress {
  $green: #66cd2e;
  $grey: #d2d2d2;
  display: flex;
  flex-direction: row;
  align-items: center;
  .progress-point {
    $size: 30px;
    display: inline-block;
    height: $size;
    width: $size;
    border-radius: 50%;
    background: $green;
    border: 6px solid white;
    box-shadow: 1px 3px 6px rgb(185, 185, 185);
    &.grey {
      $size: 33px;
      background: $grey;
      height: $size;
      width: $size;
      border: 3px solid white;
    }
    &.finish {
      $size: 33px;
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
        &.default {
          color: black;
          background: white;
        }
        .quiz-status {
          $size: 30px;
          width: $size;
          height: $size;
          border-radius: 50%;
          position: relative;
          &.right {
            background: #1d72c9;
            &::after {
              box-sizing: content-box;
              content: '';
              border: 3px solid #fff;
              border-left: 0;
              border-top: 0;
              height: 16px;
              width: 8px;
              left: 10px;
              transform: rotate(45deg);
              position: absolute;
              top: 4px;
            }
          }
          &.wrong {
            background: #fa5a7c;
            &::after {
              box-sizing: content-box;
              content: '\D7';
              font-weight: bold;
              font-size: 28px;
              position: absolute;
              top: -6px;
              left: 4px;
            }
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

