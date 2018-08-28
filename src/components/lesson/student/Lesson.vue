<template>
  <div class="lesson-wrap">
    <LessonStudentStatus v-if="isCurrentClassroom" />
    <LessonHeader :data="lessonHeaderData" :isCurrentClassroom="isCurrentClassroom" />
    <LessonSummary v-show="isShowSummary" />
    <LessonWrap v-show="!isShowSummary" v-for="(item,index) in lessonMain" :key="index" :data="item" />
    <el-dialog :visible="!isCurrentClassroom" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" center fullscreen>
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
      isRefresh: false
    }
  },
  created() {},
  beforeRouteLeave(to, from, next) {
    next()
  },
  async mounted() {
    const { packageId, lessonId } = this.$route.params
    await this.resumeTheClass()
    // this.copyProhibited()
    const { packageId: _packageId, lessonId: _lessonId } = this.enterClassInfo
    this.isCurrentClassroom = packageId == _packageId && lessonId == _lessonId
    if (!this.isCurrentClassroom) {
      return
    }
    await this.getLessonContent({ lessonId })
    this.isCurrentClassroom && (await this.uploadLearnRecords())
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