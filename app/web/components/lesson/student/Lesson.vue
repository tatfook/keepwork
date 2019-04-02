<template>
  <div class="lesson-wrap" v-loading="isLoading">
    <LessonStudentStatus v-if="isBeInClassroom && isCurrentClassroom" />
    <LessonHeader :data="lessonHeaderData" :isCurrentClassroom="isCurrentClassroom" />
    <LessonSummary v-if="isShowSummary && !isLoading" />
    <LessonWrapByGlass v-if="!isLoading" v-show="!isShowSummary" :lessonMain="lessonMain" :authUserPrivilege="authUserPrivilege" :organizations="organizations" />
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
import LessonWrapByGlass from '../common/LessonWrapByGlass'
import LessonHeader from '../common/LessonHeader'
import LessonSummary from './LessonStudentSummary'
import LessonStudentStatus from './LessonStudentStatus'
import { lesson, keepwork } from '@/api'
import _ from 'lodash'

export default {
  name: 'Learn',
  components: {
    LessonWrapByGlass,
    LessonHeader,
    LessonSummary,
    LessonStudentStatus
  },
  data() {
    return {
      isCurrentClassroom: true,
      isRefresh: false,
      _interval: null,
      isLoading: true,
      authUserPrivilege: 1,
      organizations: []
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
    const {
      query: { reload }
    } = this.$route
    if (reload === true) {
      return this.resetUrl(false)
    }
    // logined check
    if (!this.isLogined) {
      return this.toggleLoginDialog(true)
    }
    let { packageId, lessonId } = this.$route.params

    packageId = Number(packageId)
    lessonId = Number(lessonId)

    let [ res ] = await Promise.all([
      this.getPrivilege(lessonId),
      this.getLessonContent({ lessonId, packageId })
    ])
    const { authUserPrivilege = 0, organizations = [] } = res.lesson
    if (authUserPrivilege === 0) {
      this.authUserPrivilege = authUserPrivilege
      this.organizations = organizations
      return this.isLoading = false
    }
    await this.resumeTheClass()
    // 不在课堂中直接返
    if (!this.isBeInClassroom) {
      let lastLearnRecords = await lesson.lessons
        .getLastLearnRecords()
        .catch(e => console.error(e))
      lastLearnRecords = lastLearnRecords && lastLearnRecords.rows
      if (
        lastLearnRecords.length > 0 &&
        lastLearnRecords[0].state === 0 &&
        lastLearnRecords[0].packageId === packageId &&
        lastLearnRecords[0].lessonId === lessonId
      ) {
        this.resumeLearnRecordsId(lastLearnRecords[0].id)
        if (
          _.some(
            _.get(lastLearnRecords[0], 'extra.quiz[0]', []),
            ({ answer = false }) => answer
          )
        ) {
          this.resumeQuiz({ learnRecords: lastLearnRecords[0] })
        }
      } else {
        await this.createLearnRecords({
          packageId,
          lessonId
        }).catch(e => console.error(e))
      }
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

    let { device } = this.$route.query
    if (device && device.toLowerCase() === 'paracraft') {
      this.switchDevice('p')
    }

    if (this.isCurrentClassroom) {
      this.changeStatus(1)
      await this.resumeQuiz({ id }).catch(e => console.error(e))
      await this.uploadLearnRecords().catch(e => console.error(e))
    }
    this.isLoading = false
    window.document.title = this.lessonName
    if (this.isBeInClassroom) {
      this.handleCheckVisible()
      !this._interval && this.intervalCheckClass()
    }
  },
  destroyed() {
    clearTimeout(this._interval)
    // window.removeEventListener('storage', this.handleStorageEvent, false)
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
      toggleLoginDialog: 'lesson/toggleLoginDialog',
      changeStatus: 'lesson/student/changeStatus',
      createLearnRecords: 'lesson/student/createLearnRecords',
      switchDevice: 'lesson/student/switchDevice',
      resumeLearnRecordsId: 'lesson/student/resumeLearnRecordsId'
    }),
    // handleStorageEvent() {
    //   let refresh = localStorage.getItem('refresh')
    //   if (Boolean(refresh)) {
    //     localStorage.setItem('refresh', false)
    //     window.location.reload()
    //   }
    // },
    resetUrl(resetAll = true) {
      if (resetAll) {
        let url = this.$router.resolve({
          path: this.$route.path
        }).href
        history.replaceState('', '', url)
        return window.location.reload()
      }
      const {
        name,
        params,
        query: { reload, ...filterQuery }
      } = this.$route
      let url = this.$router.resolve({
        name,
        params,
        query: filterQuery
      }).href
      history.replaceState('', '', url)
      window.location.reload()
    },
    async intervalCheckClass(delay = 8 * 1000) {
      await this.checkClassroom()
      clearTimeout(this._interval)
      this._interval = setTimeout(async () => {
        await this.intervalCheckClass().catch(
          e =>
            this.$message({
              message: this.$t('lesson.classIsOver'),
              type: 'warning'
            }) && this._notify.close()
        )
      }, delay)
    },
    handleCheckVisible() {
      let hidden = false
      let visibilityChange = 'visibilitychange'
      if (typeof document.hidden !== 'undefined') {
        hidden = 'hidden'
        visibilityChange = 'visibilitychange'
      } else if (typeof document.msHidden !== 'undefined') {
        hidden = 'msHidden'
        visibilityChange = 'msvisibilitychange'
      } else if (typeof document.webkitHidden !== 'undefined') {
        hidden = 'webkitHidden'
        visibilityChange = 'webkitvisibilitychange'
      }
      document.addEventListener(
        visibilityChange,
        async () => {
          document[hidden] ? this.changeStatus(2) : this.changeStatus(1)
          // await this.uploadLearnRecords().catch(e => console.error(e))
        },
        false
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
      let { isSubscribe, coin, rmb, userId, lessons, state } = packageDetail
      if (state !== 2) {
        this.$message({
          type: 'error',
          message: this.$t('lesson.packagePendingReview')
        })
        return false
      }
      const isHasTheLesson = lessons.some(({ id }) => id === lessonId)
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
          .then(() =>
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
    },
    async getPrivilege(lessonId) {
      const res = await keepwork.graphql.getQueryResult({
        query:
          'query($id: Int){lesson(id: $id) {id, authUserPrivilege, organizations{name,cellphone}}}',
        variables: {
          id: lessonId
        }
      })
      return res
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
