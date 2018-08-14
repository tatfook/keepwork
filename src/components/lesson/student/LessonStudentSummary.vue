<template>
  <div class="lesson-summary">
    <div class="lesson-summary-wrap">
      <div class="summary-title">{{title}}</div>
      <div class="summary-body">
        <div class="word first">
          This is my
          <span class="highlight">1st</span> day of learning
          <span class="highlight">{{lessonTitle}}</span> on Keepwork.
        </div>
        <div class="word second">
          Today, I read
          <span class="highlight">{{lessonCodeReadLine}}</span> lines of code, wrote
          <span class="highlight">{{lessonWriteLine}}</span> lines of code, and learned
          <span class="highlight">{{lessonCommands}}</span> computer command.
        </div>
      </div>
      <div class="summary-share" @click="showSharePanel">
        <span class="summary-share-icon"></span>
        {{$t('lesson.share')}}
      </div>
      <img class="summary-boy" src="../../../assets/lessonImg/summary/boy.png" alt="">
    </div>

    <el-dialog :append-to-body="true" class="summary-share-dialog" center :visible.sync="isShowSharePanel" :title="$t('lesson.shareSummary')" @close="hideSharePanel" width="920px">
      <el-row :gutter="20">
        <el-col class="share-icons-wrap" :span="6">
          <div class="share-icons">
            <span class="facebook-icon"></span>
            <span class="twitter-icon"></span>
            <span class="google-icon"></span>
          </div>
          <div class="share-tips">
            {{$t('lesson.shareSummaryByNet')}}
          </div>
        </el-col>
        <el-col class="share-style" :span="18">
          <div class="share-style-title">
            {{$t('lesson.styles', { number: 3})}}
          </div>
          <div class="share-style-select-panel">
            <lesson-summary-share-style-select :lessonSummary="lessonSummary" />
          </div>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LessonSummaryShareStyleSelect from './LessonSummaryShareStyleSelect'
export default {
  name: 'LessonStudentSummary',
  components: {
    'lesson-summary-share-style-select': LessonSummaryShareStyleSelect
  },
  data() {
    return {
      isShowSharePanel: false,
      title: 'Congratulations. Learning is finished. Here is the summary.'
    }
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'lesson/student/lessonDetail'
    }),
    lesson() {
      return this.lessonDetail.modList || []
    },
    lessonData() {
      return _.get(this.lessonHeader, 'data.lesson', {})
    },
    lessonHeader() {
      return this.lesson.filter(({ cmd }) => cmd === 'Lesson')[0]
    },
    lessonTitle() {
      return _.get(this.lessonData, 'Title', '')
    },
    lessonCodeReadLine() {
      return _.get(this.lessonData, 'lessonCodeReadLine', 0)
    },
    lessonWriteLine() {
      return _.get(this.lessonData, 'lessonWriteLine', 0)
    },
    lessonCommands() {
      return _.get(this.lessonData, 'Commands', 0)
    },
    lessonSummary() {
      return {
        day: 1,
        name: this.lessonTitle,
        read: this.lessonCodeReadLine,
        write: this.lessonWriteLine,
        command: this.lessonCommands
      }
    }
  },
  methods: {
    hideSharePanel() {
      this.isShowSharePanel = false
    },
    showSharePanel() {
      this.isShowSharePanel = true
    }
  }
}
</script>


<style lang="scss">
$blue: #4093fe;
.lesson-summary {
  margin: 20px auto;
  width: 1080px;
  box-sizing: border-box;
  border-top: 1px solid #dadada;
  background: white;
  &-wrap {
    border: 16px solid #66cd2e;
    min-height: 330px;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    .summary {
      &-title {
        font-size: 28px;
        font-weight: 600;
        margin-top: 50px;
      }
      &-body {
        margin-top: 50px;
        .highlight {
          color: #ec761a;
          font-weight: 600;
        }
        .word {
          $heigth: 30px;
          height: 20px;
          line-height: 20px;
          margin-top: 20px;
          &::before {
            $size: 10px;
            content: '';
            display: inline-block;
            height: $size;
            width: $size;
            background: $blue;
            border-radius: 50%;
          }
        }
      }

      &-share {
        &-icon {
          background: url('../../../assets/lessonImg/summary/share.png')
            no-repeat center;
          display: inline-block;
          width: 20px;
          height: 22px;
        }
        cursor: pointer;
        width: 221px;
        height: 57px;
        line-height: 57px;
        font-size: 28px;
        background: $blue;
        text-align: center;
        color: white;
        font-weight: 500;
        border-radius: 57px;
        position: absolute;
        bottom: 0;
        margin-bottom: -38px;
      }

      &-boy {
        position: absolute;
        bottom: 0;
        left: 20px;
        height: auto;
        width: auto;
        z-index: 0;
        max-height: 170px;
        max-width: 100%;
      }
    }
  }
}
.summary-share-dialog {
  .share-icons-wrap {
    .share-icons {
      padding-left: 10px;
      span {
        display: inline-block;
        height: 50px;
        width: 50px;
        cursor: pointer;
        &.facebook-icon {
          background: url('../../../assets/lessonImg/summary/facebook.png')
            no-repeat center;
        }
        &.twitter-icon {
          background: url('../../../assets/lessonImg/summary/twitter.png')
            no-repeat center;
        }
        &.google-icon {
          background: url('../../../assets/lessonImg/summary/google.png')
            no-repeat center;
        }
      }
    }
    .share-tips {
      padding: 10px;
      color: #929292;
    }
  }

  .share-style {
    border-left: 1px dashed grey;
    padding-left: 22px;
    &-title {
      text-align: center;
      font-size: 18px;
    }
    &-select-panel {
      margin-top: 20px;
      min-height: 300px;
    }
  }
  .el-dialog__header {
    padding: 0;
    background: $blue;
    color: white;
    height: 60px;
    line-height: 60px;
    .el-dialog__title {
      color: white;
      font-weight: 500;
      font-size: 26px;
      height: 60px;
      line-height: 60px;
    }
    .el-dialog__close {
      color: white;
      font-size: 26px;
    }
  }
}
</style>
