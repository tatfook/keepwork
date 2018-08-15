<template>
  <div class="lesson-wrap">
    <lesson-header :data="lessonHeader" :isTeacher="true" />
    <lesson-summary v-show="isShowSummary" />
    <lesson-hint-toggle />
    <lesson-wrap v-show="!isShowSummary" v-for="(item,index) in lessonMain" :key="index" :data="item" :isPreview="true" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonWrap from '../common/LessonWrap'
import LessonHeader from '../common/LessonHeader'
import LessonTeacherSummary from './LessonTeacherSummary'
import LessonHintToggle from './LessonHintToggle'
export default {
  name: 'Learn',
  components: {
    'lesson-wrap': LessonWrap,
    'lesson-header': LessonHeader,
    'lesson-summary': LessonTeacherSummary,
    'lesson-hint-toggle': LessonHintToggle
  },
  data() {
    return {
      lessonId: ''
    }
  },
  async mounted() {
    this.lessonId = this.$route.params.lessonId || 1
    await this.fetchLessonData({ lessonId: this.lessonId })
    console.warn(this.lessonHeader)
  },
  methods: {
    ...mapActions({
      fetchLessonData: 'lesson/student/fetchLessonData'
    }),
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'lesson/student/lessonDetail',
      isShowSummary: 'lesson/student/isShowSummary'
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
  padding-bottom: 200px;
}

.quiz-no::after {
  content: counter(no);
  counter-increment: no;
}
</style>