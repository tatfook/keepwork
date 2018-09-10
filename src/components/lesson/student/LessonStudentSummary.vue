<template>
  <div class="lesson-summary">
    <student-summary :summary="lessonSummary" @share="showSharePanel" />
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
import { mapGetters, mapActions } from 'vuex'
import LessonSummaryShareStyleSelect from './LessonSummaryShareStyleSelect'
import StudentSummary from './StudentSummary'
import dayjs from 'dayjs'
import AdvancedFormat from 'dayjs/plugin/AdvancedFormat'
import { locale } from '@/lib/utils/i18n'
export default {
  name: 'LessonStudentSummary',
  components: {
    'lesson-summary-share-style-select': LessonSummaryShareStyleSelect,
    'student-summary': StudentSummary
  },
  data() {
    return {
      isShowSharePanel: false,
      title: this.$t('lesson.SelfStudyIsCompleted')
    }
  },
  computed: {
    ...mapGetters({
      userId: 'user/userId',
      lessonDetail: 'lesson/student/lessonDetail',
      subscribesList: 'lesson/student/subscribesList'
    }),
    lessonSbuscribeTime() {
      let lesson = this.subscribesList.find(o => o.id === Number(this.lessonId))
      return lesson ? lesson.createdAt : null
    },
    lesson() {
      return this.lessonDetail.lesson || {}
    },
    lessonId() {
      return this.lessonDetail.lessonId
    },
    lessonSkills() {
      return this.lesson.skills || []
    },
    lessonName() {
      return this.lesson.lessonName
    },
    lessonCodeReadLine() {
      let skill = this.lessonSkills.find(item => item.skillName == '代码阅读量')
      return skill ? skill.score : 0
    },
    lessonWriteLine() {
      let skill = this.lessonSkills.find(
        item => item.skillName === '代码书写量'
      )
      return skill ? skill.score : 0
    },
    lessonCommands() {
      let skill = this.lessonSkills.find(
        item => item.skillName === '学习指令数'
      )
      return skill ? skill.score : 0
    },
    day() {
      dayjs.extend(AdvancedFormat)
      let day = dayjs(this.lessonSbuscribeTime).format('Do')
      return this.isEn ? day : day.replace(/[^0-9]/gi, '')
    },
    isEn() {
      return locale === 'en-US' ? true : false
    },
    lessonSummary() {
      return {
        day: this.day,
        name: this.lessonName,
        read: this.lessonCodeReadLine,
        write: this.lessonWriteLine,
        command: this.lessonCommands
      }
    }
  },
  methods: {
    ...mapActions({
      getUserSubscribes: 'lesson/student/getUserSubscribes'
    }),
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
