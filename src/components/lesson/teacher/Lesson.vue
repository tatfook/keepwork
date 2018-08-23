<template>
  <div class="lesson-wrap">
    <lesson-header :data="lessonHeader" :isTeacher="true" @intervalUpdateLearnRecords="intervalUpdateLearnRecords" @clearUpdateLearnRecords="clearUpdateLearnRecords" />
    <lesson-hint-toggle v-show="isShowLesson" />
    <lesson-wrap v-show="isShowLesson" v-for="(item,index) in lessonMain" :key="index" :data="item" :isPreview="true" />
    <lesson-performance v-show="isShowPerformance" @intervalUpdateLearnRecords="intervalUpdateLearnRecords" />
    <lesson-summary v-if="isShowSummary" />
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
  async created() {
    const { packageId, lessonId } = this.$route.params
    await Promise.all([this.getCurrentClass(), this.getLessonContent(lessonId)])
  },
  async destroy() {
    this.clearUpdateLearnRecords()
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/teacher/getLessonContent',
      getCurrentClass: 'lesson/teacher/getCurrentClass',
      updateLearnRecords: 'lesson/teacher/updateLearnRecords'
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
    }
  },
  computed: {
    ...mapGetters({
      isShowLesson: 'lesson/teacher/isShowLesson',
      isShowPerformance: 'lesson/teacher/isShowPerformance',
      isShowSummary: 'lesson/teacher/isShowSummary',
      lessonDetail: 'lesson/teacher/lessonDetail',
      isBeInClass: 'lesson/teacher/isBeInClass'
    }),
    lesson() {
      return this.lessonDetail.modList || []
    },
    lessonHeader() {
      return this.lesson.filter(({ cmd }) => cmd === 'Lesson')[0]
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