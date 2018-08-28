<template>
  <div class="lesson-wrap">
    <lesson-header :data="lessonHeader" :isTeacher="true" :isInCurrentClass="isInCurrentClass" @intervalUpdateLearnRecords="intervalUpdateLearnRecords" @clearUpdateLearnRecords="clearUpdateLearnRecords" />
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonWrap from '../common/LessonWrap'
import LessonHeader from '../common/LessonHeader'
import LessonTeacherSummary from './LessonTeacherSummary'
import LessonStudentPerformance from './LessonStudentPerformance'
import LessonHintToggle from './LessonHintToggle'
export default {
  name: 'Learn',
  components: {
    'lesson-wrap': LessonWrap,
    'lesson-header': LessonHeader,
    'lesson-summary': LessonTeacherSummary,
    'lesson-performance': LessonStudentPerformance,
    'lesson-hint-toggle': LessonHintToggle
  },
  data() {
    return {
      _interval: null
    }
  },
  async mounted() {
    const { name, params: { packageId, lessonId } } = this.$route
    await this.getCurrentClass()
    await this.getLessonContent(lessonId)
    if (
      name === 'summary' ||
      (name === 'performance' && !this.isBeInClass) ||
      !this.isInCurrentClass
    ) {
      this.$router.push({ name: 'plan' })
    }
    this.isInCurrentClass
      ? this.intervalUpdateLearnRecords()
      : this.notifyBackRoom()
  },
  async destroyed() {
    this.clearUpdateLearnRecords()
    this.leaveTheClassroom()
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/teacher/getLessonContent',
      getCurrentClass: 'lesson/teacher/getCurrentClass',
      updateLearnRecords: 'lesson/teacher/updateLearnRecords',
      leaveTheClassroom: 'lesson/teacher/leaveTheClassroom'
    }),
    async intervalUpdateLearnRecords(delay = 3000) {
      await this.updateLearnRecords()
      clearTimeout(this._interval)
      this._interval = setTimeout(
        () => this.intervalUpdateLearnRecords(),
        delay
      )
    },
    clearUpdateLearnRecords() {
      clearTimeout(this._interval)
    },
    backToClassroom() {
      const { packageId, lessonId } = this.classroom
      this.$router.push(`/teacher/package/${packageId}/lesson/${lessonId}`)
      this.$router.go(0)
    },
    notifyBackRoom() {
      const h = this.$createElement
      this.$notify({
        title: '你还在授课中',
        message: h('span', { style: 'cursor: pointer' }, '点击返回课堂'),
        type: 'warning',
        position: 'top-left',
        duration: 0,
        showClose: false,
        onClick: this.backToClassroom
      })
    }
  },
  computed: {
    ...mapGetters({
      isShowLesson: 'lesson/teacher/isShowLesson',
      isShowPerformance: 'lesson/teacher/isShowPerformance',
      isShowSummary: 'lesson/teacher/isShowSummary',
      lessonDetail: 'lesson/teacher/lessonDetail',
      isBeInClass: 'lesson/teacher/isBeInClass',
      isClassIsOver: 'lesson/teacher/isClassIsOver',
      classroom: 'lesson/teacher/classroom'
    }),
    isInCurrentClass() {
      const { packageId: pid, lessonId: lid } = this.$route.params
      const { packageId, lessonId } = this.classroom
      let flag = packageId == pid && lessonId == lid
      return this.isBeInClass ? flag : true
    },
    lesson() {
      return this.lessonDetail.modList || []
    },
    lessonHeader() {
      return this.lesson.filter(({ cmd }) => cmd === 'Lesson')[0]
    },
    lessonMain() {
      return this.lesson.filter(({ cmd }) => cmd !== 'Lesson')
    }
  },
  beforeRouteUpdate({ name }, from, next) {
    if (name === 'summary' && !this.isClassIsOver) {
      return this.$router.push({ name: 'plan' })
    }
    if (name === 'performance' && !this.isBeInClass) {
      this.intervalUpdateLearnRecords()
      return this.$router.push({ name: 'plan' })
    }
    next()
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