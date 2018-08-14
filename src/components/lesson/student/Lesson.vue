<template>
  <div class="lesson-wrap">
    <lesson-header :data="lessonHeader" />
    <lesson-summary v-show="isShowSummary" />
    <lesson-wrap v-show="!isShowSummary" v-for="(item,index) in lessonMain" :key="index" :data="item" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonWrap from '../common/LessonWrap'
import LessonHeader from '../common/LessonHeader'
import LessonSummary from './LessonStudentSummary'
export default {
  name: 'Learn',
  components: {
    'lesson-wrap': LessonWrap,
    'lesson-header': LessonHeader,
    'lesson-summary': LessonSummary
  },
  data() {
    return {
      lessonId: ''
    }
  },
  async mounted() {
    this.copyProhibited()
    this.lessonId = this.$route.params.lessonId || 1
    await this.fetchLessonData({ lessonId: this.lessonId })
    console.warn(this.lessonHeader)
  },
  methods: {
    ...mapActions({
      fetchLessonData: 'lesson/student/fetchLessonData'
    }),
    copyProhibited() {
      document.oncontextmenu = new Function('event.returnValue=false')
      document.onselectstart = new Function('event.returnValue=false')
      document.onkeydown = () => {
        if (event.ctrlKey && window.event.keyCode === 67) return false
        if (event.ctrlKey && window.event.keyCode === 86) return false
      }
      document.body.oncopy = () => false
    }
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'lesson/student/lessonDetail',
      lessonQuizDone: 'lesson/student/lessonQuizDone',
      isShowSummary: 'lesson/student/isShowSummary'
    }),
    lesson() {
      return this.lessonDetail.modList || []
    },
    lessonHeader() {
      return this.lesson.filter(({ cmd }) => cmd === 'Lesson')[0]
    },
    lessonMain() {
      // TODO: 这里应该还有bigfile和markdown
      return this.lesson.filter(({ cmd }) => cmd === 'Quiz')
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