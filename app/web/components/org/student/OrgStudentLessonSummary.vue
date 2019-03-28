<template>
  <div class="lesson-summary">
    <student-summary :summary="summary" @share="showSharePanel" />
    <el-dialog :append-to-body="true" class="summary-share-dialog" center :visible.sync="isShowSharePanel" :title="$t('lesson.shareSummary')" @close="hideSharePanel" width="920px">
      <div class="share-style-title">
        {{$t('lesson.styles', { number: 3})}}
      </div>
      <div class="share-style-select-panel">
        <lesson-summary-share-style-select :lessonSummary="lessonSummary" ref="shareStyle" />
      </div>
      <div class="share-icons" v-if="IS_GLOBAL_VERSION">
        <span class="facebook-icon"></span>
        <span class="twitter-icon"></span>
        <span class="google-icon"></span>
      </div>
      <div class="share-icons" v-else>
        <div class="summary-share-lesson" @click="showSocialShare"></div>
        <!-- <span class="iconfont icon-qq1" @click="shareTo('qq')"></span>
        <span class="iconfont icon-interspace" @click="shareTo('qzone')"></span>
        <span class="iconfont icon-weibo" @click="shareTo('sina')"></span> -->
      </div>
      <div class="share-tips">
        {{$t('lesson.shareSummaryByNet')}}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import 'social-share.js/dist/js/social-share.min.js'
import 'social-share.js/dist/css/share.min.css'
import { mapGetters, mapActions } from 'vuex'
import LessonSummaryShareStyleSelect from './LessonSummaryShareStyleSelect'
import StudentSummary from './StudentSummary'
import { lesson } from '@/api'
import _ from 'lodash'
import { locale } from '@/lib/utils/i18n'
import moment from 'moment'
const IS_GLOBAL_VERSION = !!process.env.IS_GLOBAL_VERSION

export default {
  name: 'OrgStudentLessonSummary',
  components: {
    LessonSummaryShareStyleSelect,
    StudentSummary
  },
  data() {
    return {
      isShowSharePanel: false,
      title: this.$t('lesson.SelfStudyIsCompleted'),
      learnRecords: [],
      IS_GLOBAL_VERSION
    }
  },
  async mounted() {
    await lesson.lessons
      .learnRecords({ lessonId: this.lessonId })
      .then(res => {
        this.learnRecords = res
      })
      .catch(err => console.error(err))
  },
  computed: {
    ...mapGetters({
      userId: 'user/userId',
      lessonDetail: 'org/student/orgLessonDetail',
      // subscribesList: 'lesson/student/subscribesList',
      howManyDays: 'org/student/howManyDays'
    }),
    // lessonSbuscribeTime() {
    //   let lesson = this.subscribesList.find(o => o.id === Number(this.lessonId))
    //   return lesson ? lesson.createdAt : null
    // },
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
    videoUrl() {
      return _.get(this.lesson, 'extra.videoUrl', '')
    },
    coverUrl() {
      return _.get(this.lesson, 'extra.coverUrl', '')
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
    learnRecordsTimes() {
      return _.map(
        _.filter(this.learnRecords, ({ state }) => state === 1),
        ({ createdAt }) => {
          const time = new Date(createdAt)
          const year = time.getFullYear()
          const month = time.getMonth()
          const date = time.getDate()
          return `${year}${month}${date}`
        }
      )
    },
    firstTime() {
      return _.get(this, 'learnRecord[0].createdAt', '')
    },
    lastTime() {
      let arr = this.learnRecords.filter(({ extra: { quiz } }) =>
        quiz.every(item => item.result !== null)
      )
      if (arr.length === 0) {
        return ''
      }
      return arr.pop().createdAt
    },
    isEn() {
      return locale === 'en-US' ? true : false
    },
    studyTime() {
      const suffix = ['th', 'st', 'nd', 'rd', 'th']
      let day = this.howManyDays
      if (this.isEn) {
        let remainder = day % 10
        day = remainder > 3 ? `${day}th` : `${day}${suffix[remainder]}`
      }
      return day
    },
    summary() {
      return {
        day: this.howManyDays,
        name: this.lessonName,
        skills: this.lessonSkills
      }
    },
    lessonSummary() {
      return {
        day: this.studyTime,
        name: this.lessonName,
        read: this.lessonCodeReadLine,
        write: this.lessonWriteLine,
        command: this.lessonCommands,
        videoUrl: this.videoUrl,
        coverUrl: this.coverUrl
      }
    }
  },
  methods: {
    showSocialShare() {
      let origin = window.location.origin
      let packageId = this.$route.params.packageId
      let lessonId = this.$route.params.lessonId
      let styleId = this.$refs.shareStyle.currentStyle
      let shareWebUrl = `${origin}/l/share/package/${packageId}/lesson/${lessonId}/style/${styleId}?day=${
        this.studyTime
      }&name=${this.lessonName}&read=${this.lessonCodeReadLine}&write=${
        this.lessonWriteLine
      }&command=${this.lessonCommands}&videoUrl=${encodeURIComponent(this.videoUrl)}&coverUrl=${encodeURIComponent(this.coverUrl)}`
      shareWebUrl = encodeURI(shareWebUrl)
      window.socialShare('.summary-share-lesson', {
        url: shareWebUrl,
        mode: 'prepend',
        image: this.coverUrl,
        description: `我在KeepWork学习${this.lessonName},快来跟我一起吧！`,
        title: 'keepwork',
        sites: ['qq', 'qzone', 'weibo'],
        wechatQrcodeTitle: '',
        wechatQrcodeHelper: this.$t('common.QR')
      })
    },
    hideSharePanel() {
      this.isShowSharePanel = false
    },
    showSharePanel() {
      this.isShowSharePanel = true
      this.$nextTick(() => {
        this.showSocialShare()
      })
    }
  }
}
</script>

<style lang="scss">
$blue: #4093fe;
.lesson-summary {
  margin: 0 auto;
  box-sizing: border-box;
  border-top: 1px solid #dadada;
  background: white;
  max-width: 1229px;
  padding-bottom: 40px;
}
.summary-share-dialog {
  .el-dialog__header {
    padding: 0;
    background: #4093fe;
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
  .share-icons {
    margin-top: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 40px;
      display: inline-block;
      height: 50px;
      width: 66px;
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
    .icon-qq1 {
      color: #358bff;
    }
    .icon-interspace {
      color: #f5c01c;
    }
    .icon-weibo {
      color: #e6162d;
    }
  }
  .share-tips {
    text-align: center;
    padding: 10px;
    color: #929292;
  }
}
.share-style {
  &-title {
    text-align: center;
    font-size: 18px;
  }
  &-select-panel {
    margin-top: 20px;
  }
}
@media screen and (max-width: 768px){
.summary-share-dialog {
  .el-dialog{
    max-width: 94%;
  }
}
}
</style>

