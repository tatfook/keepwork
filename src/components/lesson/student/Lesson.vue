<template>
  <div class="lesson-wrap">
    <LessonStudentStatus v-if="isBeInClassroom && isCurrentClassroom" />
    <LessonHeader :data="lessonHeaderData" :isCurrentClassroom="isCurrentClassroom" />
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
      isCurrentClassroom: false
    }
  },
  created() {
    console.log('created=-------------->')
  },
  beforeRouteLeave(to, from, next) {
    if (this.isBeInClassroom) {
      return this.$message.error('你还在上课')
    }
    next()
  },
  async mounted() {
    const { packageId, lessonId } = this.$route.params
    await this.resumeTheClass()
    // this.copyProhibited()
    await this.getLessonContent({ lessonId })
    if (this.isBeInClassroom) {
      const { packageId: _packageId, lesson: _lessonId } = this.enterClassInfo
      this.isCurrentClassroom = packageId === _packageId && lessonId === _lessonId
      this.isCurrentClassroom && (await this.uploadLearnRecords())
    }
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/student/getLessonContent',
      resumeTheClass: 'lesson/student/resumeTheClass',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords'
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