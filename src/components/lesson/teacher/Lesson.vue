<template>
  <div class="lesson-wrap" v-loading="isLoading">
    <lesson-header class='lesson-header' :data="lessonHeader" :isTeacher="true" :isInCurrentClass="isInCurrentClass" @intervalUpdateLearnRecords="intervalUpdateLearnRecords" @clearUpdateLearnRecords="clearUpdateLearnRecords" />
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
      _interval: null,
      isLoading: true
    }
  },
  async mounted() {
    const { name, params: { packageId, lessonId } } = this.$route
    await this.getCurrentClass().catch(e => console.error(e))
    await this.getLessonContent({ lessonId, packageId }).catch(e => console.error(e))
    this.isLoading = false
    if (
      name === 'LessonTeacherSummary' ||
      (name === 'LessonTeacherPerformance' && !this.isBeInClass) ||
      !this.isInCurrentClass
    ) {
      this.$router.push({ name: 'LessonTeacherPlan' })
    }
    this.isInCurrentClass && this.intervalUpdateLearnRecords()
    window.document.title = this.lessonName
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
      leaveTheClassroom: 'lesson/teacher/leaveTheClassroom',
    }),
    async intervalUpdateLearnRecords(delay = 3000) {
      await this.updateLearnRecords()
      clearTimeout(this._interval)
      this._interval = setTimeout(
        () => this.intervalUpdateLearnRecords(),
        delay
      )
    },
    async clearUpdateLearnRecords() {
      clearTimeout(this._interval)
      await this.updateLearnRecords()
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
      return this.lessonDetail.lesson
    },
    lessonName() {
      return this.lessonHeader.lessonName || 'KeepWork'
    },
    lessonMain() {
      return this.lesson.filter(({ cmd }) => cmd !== 'Lesson')
    }
  },
  beforeRouteUpdate({ name }, from, next) {
    if (name === 'LessonTeacherSummary' && !this.isClassIsOver) {
      return this.$router.push({ name: 'plan' })
    }
    if (name === 'LessonTeacherPerformance' && !this.isBeInClass) {
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
@media print {
  .lesson-header {
    display: none;
  }
}
</style>
