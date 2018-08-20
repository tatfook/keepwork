<template>
  <div class="lesson-wrap">
    <lesson-header :data="lessonHeader" :isTeacher="true" />
    <!-- <lesson-hint-toggle v-show="isShowLesson" />
    <lesson-wrap v-show="isShowLesson" v-for="(item,index) in lessonMain" :key="index" :data="item" :isPreview="true" /> -->
    <lesson-performance v-show="isShowPerformance" />
    <lesson-summary v-show="isShowSummary" />
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
    return {}
  },
  async mounted() {
    const { packageId, lessonId } = this.$route.params
    await this.getLessonContent(lessonId)
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/teacher/getLessonContent'
    })
  },
  computed: {
    ...mapGetters({
      isShowLesson: 'lesson/teacher/isShowLesson',
      isShowPerformance: 'lesson/teacher/isShowPerformance',
      isShowSummary: 'lesson/teacher/isShowSummary',
      lessonDetail: 'lesson/teacher/lessonDetail'
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