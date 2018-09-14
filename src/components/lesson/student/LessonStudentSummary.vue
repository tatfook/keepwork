<template>
  <div class="lesson-summary">
    <student-summary :summary="summary" @share="showSharePanel" />
    <el-dialog :append-to-body="true" class="summary-share-dialog" center :visible.sync="isShowSharePanel" :title="$t('lesson.shareSummary')" @close="hideSharePanel" width="920px">
      <div class="share-style-title">
        {{$t('lesson.styles', { number: 3})}}
      </div>
      <div class="share-style-select-panel">
        <lesson-summary-share-style-select :lessonSummary="lessonSummary" ref="shareStyle"/>
      </div>
      <div class="share-icons" v-if="IS_GLOBAL_VERSION">
        <span class="facebook-icon"></span>
        <span class="twitter-icon"></span>
        <span class="google-icon"></span>
      </div>
      <div class="share-icons" v-else>
        <span class="iconfont icon-qq1" @click="shareTo('qq')"></span>
        <span class="iconfont icon-interspace" @click="shareTo('qzone')"></span>
        <span class="iconfont icon-weibo" @click="shareTo('sina')"></span>
      </div>
      <div class="share-tips">
        {{$t('lesson.shareSummaryByNet')}}
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonSummaryShareStyleSelect from './LessonSummaryShareStyleSelect'
import StudentSummary from './StudentSummary'
import { lesson } from '@/api'
import _ from 'lodash'
import dayjs from 'dayjs'
import { locale } from '@/lib/utils/i18n'
const IS_GLOBAL_VERSION = !!process.env.IS_GLOBAL_VERSION

export default {
  name: 'LessonStudentSummary',
  components: {
    'lesson-summary-share-style-select': LessonSummaryShareStyleSelect,
    'student-summary': StudentSummary
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
    videoUrl() {
      return this.lesson.extra.videoUrl
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
    firstTime() {
      return _.get(this, 'learnRecords[0].createdAt', '')
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
      const suffix = ['', 'st', 'nd', 'rd', 'th']
      if (this.firstTime && this.lastTime) {
        let firstTime = new Date(this.firstTime).getTime()
        let lastTime = new Date(this.lastTime).getTime()
        let day =
          Math.floor(
            Math.abs(firstTime - lastTime) / 1000 / 60 / 60 / 24 + 0.5
          ) || 1
        return day
      }
      return 1
    },
    summary() {
      return {
        firstTime: this.firstTime,
        lastTime: this.lastTime,
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
        videoUrl: this.videoUrl
      }
    }
  },
  methods: {
    hideSharePanel() {
      this.isShowSharePanel = false
    },
    showSharePanel() {
      this.isShowSharePanel = true
    },
    shareTo(socialPlatform){
      let origin = window.location.origin
      let packageId = this.$route.params.packageId
      let lessonId = this.$route.params.lessonId
      let styleId = this.$refs.shareStyle.currentStyle
      let shareWebUrl = `${origin}/lesson.html#/share/package/${packageId}/lesson/${lessonId}/style/${styleId}?day=${this.studyTime}&name=${this.lessonName}&read=${this.lessonCodeReadLine}&write=${this.lessonWriteLine}&command=${this.lessonCommands}&videoUrl=${this.videoUrl}`
      shareWebUrl = encodeURIComponent(shareWebUrl)
      let shareTitle = 'keepwork'
      let imgUrl = `https://git-stage.keepwork.com/gitlab_www_keepgo1230/keepworkdatasource/raw/master/keepgo1230_images/img_1530177473927.png`
      let content = '我在keepwork上面学习'
      if(socialPlatform=='qq'){
        window.open('http://connect.qq.com/widget/shareqq/index.html?url='+shareWebUrl+'?sharesource=qzone&title='+shareTitle+'&pics='+imgUrl+'&summary='+content+'&desc=keepwork自学网，一个前端工程师的网站');
      }
      if(socialPlatform=='qzone'){
        window.open('https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+shareWebUrl+'?sharesource=qzone&title='+shareTitle+'&pics='+imgUrl+'&summary='+content);
      }
      if(socialPlatform=='sina'){
        window.open('http://service.weibo.com/share/share.php?url='+shareWebUrl+'?sharesource=weibo&title='+shareTitle+'&pic='+imgUrl+'&appkey=2706825840');
      }
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
</style>
