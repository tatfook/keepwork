<template>
  <div class="lesson-wrap">
    <LessonStudentStatus v-if="isBeInClassroom && isCurrentClassroom" />
    <LessonHeader :data="lessonHeaderData" :isCurrentClassroom="isCurrentClassroom" />
    <LessonSummary v-if="isShowSummary" />
    <LessonWrap v-show="!isShowSummary" v-for="mod in lessonMain" :key="mod.key" :mod="mod" />
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
      _interval: null
    }
  },
  beforeRouteLeave(to, from, next) {
    if (!this.isBeInClassroom) {
      this.clearLearnRecordsId()
      this.clearLessonData()
    }
    next()
  },
  async created() {
    const { packageId, lessonId } = this.$route.params
    this.isBeInClassroom && (await this.resumeTheClass())
    // 不在课堂中直接返
    if (!this.isBeInClassroom) {
      return await this.getLessonContent({ lessonId })
    }
    // 判断是否是进入同一个课程包和课程，这种情况只有用户手动输入路由并且刷新页面才会存在
    const {
      packageId: _packageId,
      lessonId: _lessonId,
      id
    } = this.enterClassInfo
    this.isCurrentClassroom = packageId == _packageId && lessonId == _lessonId
    if (this.isCurrentClassroom) {
      await this.getLessonContent({ lessonId })
      await this.resumeQuiz({ id })
      await this.uploadLearnRecords()
    }
  },
  mounted() {
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
      checkClassroom: 'lesson/student/checkClassroom'
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
    }
  },
  computed: {
    ...mapGetters({
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
    lessonHeaderData() {
      return this.lessonDetail.lesson
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
</style>