<template>
  <div class="lesson-wrap">
    <LessonStudentStatus v-if="isBeInClassroom" />
    <LessonHeader :data="lessonHeaderData" />
    <LessonSummary v-show="isShowSummary" />
    <LessonWrap v-show="!isShowSummary" v-for="(item,index) in lessonMain" :key="index" :data="item" />
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
      lessonId: ''
    }
  },
  async mounted() {
    // this.copyProhibited()
    this.lessonId = this.$route.params.lessonId || 1
    await this.getLessonContent({ lessonId: this.lessonId })
    console.warn(this.lessonHeader)
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/student/getLessonContent'
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
      isShowSummary: 'lesson/student/isShowSummary',
      isBeInClassroom: 'lesson/student/isBeInClassroom'
    }),
    lesson() {
      return this.lessonDetail.modList || []
    },
    lessonHeaderData() {
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
  padding-bottom: 20px;
}

.quiz-no::after {
  content: counter(no);
  counter-increment: no;
}
</style>