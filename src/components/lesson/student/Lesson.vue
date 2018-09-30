<template>
  <div class="lesson-wrap" v-loading="isLoading">
    <LessonStudentStatus v-if="isBeInClassroom && isCurrentClassroom" />
    <LessonHeader :data="lessonHeaderData" :isCurrentClassroom="isCurrentClassroom" />
    <LessonSummary v-if="isShowSummary" />
    <LessonWrap v-show="!isShowSummary" v-for="mod in lessonMainUid" :key="mod.key" :mod="mod" />
    <el-dialog :visible="!isCurrentClassroom && isBeInClassroom" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" center fullscreen>
      <span slot="title">
        你正处于上课状态,请点击按钮返回当前所在的课堂
      </span>
      <span slot="footer">
        <el-button type="primary" @click="backToClassroom" :loading="!isCurrentClassroom && isRefresh">确定返回</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonWrap from '../common/LessonWrap'
import LessonHeader from '../common/LessonHeader'
import LessonSummary from './LessonStudentSummary'
import LessonStudentStatus from './LessonStudentStatus'
import { lesson } from '@/api'
import uuid from 'uuid/v1'
export default {
  name: 'Learn',
  components: {
    LessonWrap,
    LessonHeader,
    LessonSummary,
    LessonStudentStatus
  },
  data() {
    return {
      isCurrentClassroom: true,
      isRefresh: false,
      _interval: null,
      isLoading: true
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isBeInClassroom) {
      this.clearLearnRecordsId()
      this.clearLessonData()
    }
    next()
  },
  created() {
    this.switchSummary(false)
  },
  async mounted() {
    // logined check
    if (!this.isLogined) {
      return this.toggleLoginDialog(true)
    }
    const { packageId, lessonId } = this.$route.params
    // purchased check or lesson check
    let isPurchased = await this.checkPackagePurchased(
      { packageId },
      Number(lessonId)
    )
    if (!isPurchased) return
    if (this.isBeInClassroom) {
      await this.resumeTheClass().catch(e => console.error(e))
    }
    // 不在课堂中直接返
    if (!this.isBeInClassroom) {
      await this.getLessonContent({ lessonId }).catch(e => console.error(e))
      window.document.title = this.lessonName
      return (this.isLoading = false)
    }
    // 判断是否是进入同一个课程包和课程，这种情况只有用户手动输入路由并且刷新页面才会存在
    const {
      packageId: _packageId,
      lessonId: _lessonId,
      id
    } = this.enterClassInfo
    this.isCurrentClassroom = packageId == _packageId && lessonId == _lessonId
    if (this.isCurrentClassroom) {
      await this.getLessonContent({ lessonId }).catch(e => console.error(e))
      await this.resumeQuiz({ id }).catch(e => console.error(e))
      await this.uploadLearnRecords().catch(e => console.error(e))
    }
    this.isLoading = false
    window.document.title = this.lessonName
    this.isBeInClassroom && !this._interval && this.intervalCheckClass()
  },
  destroyed() {
    clearTimeout(this._interval)
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/student/getLessonContent',
      resumeTheClass: 'lesson/student/resumeTheClass',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords',
      resumeQuiz: 'lesson/student/resumeQuiz',
      clearLearnRecordsId: 'lesson/student/clearLearnRecordsId',
      clearLessonData: 'lesson/student/clearLessonData',
      checkClassroom: 'lesson/student/checkClassroom',
      switchSummary: 'lesson/student/switchSummary',
      toggleLoginDialog: 'lesson/toggleLoginDialog'
    }),
    async intervalCheckClass(delay = 8 * 1000) {
      console.warn('检查课堂是否还在')
      await this.checkClassroom()
      clearTimeout(this._interval)
      this._interval = setTimeout(
        async () =>
          await this.intervalCheckClass().catch(
            e =>
              this.$message({
                message: this.$t('lesson.classIsOver'),
                type: 'warning'
              }) && this._notify.close()
          ),
        delay
      )
    },
    backToClassroom() {
      const { packageId, lessonId } = this.enterClassInfo
      this.$router.push(`/student/package/${packageId}/lesson/${lessonId}`)
      this.isRefresh = true
      this.$router.go(0)
    },
    async checkPackagePurchased(payload, lessonId = null) {
      if (this.isBeInClassroom) return true
      const packageDetail = await lesson.packages
        .packageDetail(payload)
        .catch(e => {
          console.error(e)
        })
      let { isSubscribe, coin, rmb, userId, lessons } = packageDetail
      const isHasTheLesson = lessons
        .map(({ id }) => id)
        .find(id => id === lessonId)
      // 判断该课程包是否存在该课程
      if (!isHasTheLesson) {
        this.$message({
          type: 'error',
          message: this.$t('lesson.urlError')
        })
        return false
      }
      if (this.userId === userId) return true
      isSubscribe = Boolean(isSubscribe)
      const isFree = coin === 0 && rmb === 0
      if (!isSubscribe) {
        this.$confirm(this.$t('lesson.addPackageFirst'), '', {
          showClose: false,
          showCancelButton: false,
          closeOnPressEscape: false,
          closeOnClickModal: false,
          iconClass: 'iconfont icon-BOOK add-package-confirm',
          center: true,
          confirmButtonText: this.$t('lesson.toAdd')
        })
          .then(
            () =>
              isFree
                ? this.addThePackage(payload)
                : this.goToPurchase(payload, lessonId)
          )
          .catch(e => console.log(e))
      }
      return isSubscribe
    },
    async addThePackage(payload) {
      await lesson.packages
        .subscribe(payload)
        .then(res => {
          this.$message({
            type: 'success',
            message: this.$t('lesson.addPackageSuccess')
          })
          setTimeout(() => this.$router.go(0), 1000)
        })
        .catch(e => console.error(e))
    },
    goToPurchase({ packageId }, lessonId) {
      this.$router.push(
        `/student/package/${packageId}/purchase?lessonId=${lessonId}`
      )
    }
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined',
      lessonDetail: 'lesson/student/lessonDetail',
      lessonQuizDone: 'lesson/student/lessonQuizDone',
      isShowSummary: 'lesson/student/isShowSummary',
      isBeInClassroom: 'lesson/student/isBeInClassroom',
      userinfo: 'lesson/userinfo',
      enterClassInfo: 'lesson/student/enterClassInfo'
    }),
    currentClassroomId() {
      return _.get(this.userinfo, 'extra.classroomId', '')
    },
    lesson() {
      return this.lessonDetail.modList || []
    },
    userId() {
      return _.get(this.userinfo, 'id', '')
    },
    lessonHeaderData() {
      return this.lessonDetail.lesson || {}
    },
    lessonName() {
      return this.lessonHeaderData.lessonName || 'KeepWork'
    },
    lessonMain() {
      return this.lesson.filter(({ cmd }) => cmd !== 'Lesson')
    },
    lessonMainUid() {
      this.lessonMain.map(item => item).forEach(item => item.key = uuid())
    }
  }
}
</script>

<style lang="scss">
.lesson-wrap {
  counter-reset: no;
  padding-bottom: 20px;
}

.quiz-no::after {
  content: counter(no);
  counter-increment: no;
}
.add-package-confirm {
  &.icon-BOOK:before {
    font-size: 100px;
    color: #909399;
  }
}
</style>