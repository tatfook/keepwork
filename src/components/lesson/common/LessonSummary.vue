<template>
    <div class="lesson-summary">
        <div class="lesson-summary-wrap">
            <div class="summary-title">{{title}}</div>
            <div class="summary-body">
                <div class="word first">
                    This is my
                    <span class="highlight">1st</span> day of learning
                    <span class="highlight">computer science</span> on Keepwork.
                </div>
                <div class="word second">
                    Today, I read
                    <span class="highlight">20</span> lines of code, wrote
                    <span class="highlight">5</span> lines of code, and learned 1 computer command.
                </div>
            </div>
            <div class="summary-share" @click="showSharePanel">
                <span class="summary-share-icon"></span>
                {{$t('lesson.share')}}
            </div>
            <img class="summary-boy" src="../../../assets/lessonImg/summary/boy.png" alt="">
        </div>

        <el-dialog :append-to-body="true" class="summary-share-dialog" center :visible.sync="isShowSharePanel" title="Share Summary" @close="hideSharePanel" width="1080px">
            <el-row :gutter="20">
                <el-col class="share-icons-wrap" :span="4">
                    <div class="share-icons">
                        <span class="facebook-icon"></span>
                        <span class="twitter-icon"></span>
                        <span class="google-icon"></span>
                    </div>
                </el-col>
                <el-col class="share-style" :span="20">
                    <div class="share-style-title">
                        3 styles are avaliable. Please select one.
                    </div>
                    <div class="share-style-select-panel">
                        <lesson-summary-share-style-select/>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import LessonSummaryShareStyleSelect from './LessonSummaryShareStyleSelect'
export default {
  name: 'LessonSummary',
  components: {
    'lesson-summary-share-style-select': LessonSummaryShareStyleSelect
  },
  data() {
    return {
      isShowSharePanel: true,
      title: 'Congratulations. Learning is finished. Here is the summary.'
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
