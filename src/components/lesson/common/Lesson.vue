<template>
  <div class="lesson-wrap">
    <lesson-header :data="lessonHeader" />
    <lesson-summary v-if="!lessonQuizDone" />
    <lesson-wrap v-else v-for="(item,index) in lessonMain" :key="index" :data="item" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonWrap from './LessonWrap'
import LessonHeader from './LessonHeader'
import LessonSummary from './LessonSummary'
export default {
  name: 'Learn',
  components: {
    'lesson-wrap': LessonWrap,
    'lesson-header': LessonHeader,
    'lesson-summary': LessonSummary
  },
  mounted() {
    this.copyProhibited()
    console.warn(this.lesson)
  },
  data() {
    return {
      lessonId: ''
    }
  },
  async mounted() {
    this.lessonId = this.$route.params.id || 1
    await this.fetchLessonData({ lessonId: this.lessonId })
    console.log(this.lessonDetail)
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
      lessonQuizDone: 'lesson/student/lessonQuizDone'
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
  padding-bottom: 300px;
}

.quiz-no::after {
  content: counter(no);
  counter-increment: no;
}
</style>