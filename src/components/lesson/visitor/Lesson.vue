<template>
  <div class="lesson-wrap" v-loading="isLoading">
    <LessonStudentStatus v-if="isBeInClassroom" :isVisitor="true" :classKey="classKey" />
    <LessonHeader :data="lessonHeaderData" :isVisitor="true" />
    <LessonSummary v-if="isShowSummary" />
    <LessonWrap v-show="!isShowSummary" v-for="mod in lessonMain" :key="mod.key" :mod="mod" :isVisitor="true" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonWrap from '../common/LessonWrap'
import LessonHeader from '../common/LessonHeader'
import LessonSummary from '@/components/lesson/student/LessonStudentSummary'
import LessonStudentStatus from '@/components/lesson/student/LessonStudentStatus'
export default {
  name: 'Visitor',
  components: {
    LessonWrap,
    LessonHeader,
    LessonSummary,
    LessonStudentStatus
  },
  data() {
    return {
      isRefresh: false,
      _interval: null,
      isLoading: false,
      classKey: '',
      isBeInClassroom: false
    }
  },
  created() {
    this.switchSummary(false)
  },
  async mounted() {
    const { key, token, id } = this.$route.query
    this.classKey = key || ''
    if (id && key && id !== 0 && token !== 0) {
      this.isBeInClassroom = true
    }
    this.saveVisitorInfo({ classId: id, key, token })
    let { packageId, lessonId } = this.$route.params
    packageId = Number(packageId)
    lessonId = Number(lessonId)
    await this.getLessonContent({ lessonId, packageId }).catch(e =>
      console.error(e)
    )
    window.document.title = this.lessonName
    await this.uploadVisitorLearnRecords({
      packageId,
      lessonId,
      state: 0
    })
    this.resetUrl()
    this.isLoading = false
  },
  destroyed() {
    clearTimeout(this._interval)
    this.clearVisitorInfo()
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/student/getLessonContent',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords',
      clearLearnRecordsId: 'lesson/student/clearLearnRecordsId',
      clearLessonData: 'lesson/student/clearLessonData',
      switchSummary: 'lesson/student/switchSummary',
      changeStatus: 'lesson/student/changeStatus',
      saveVisitorInfo: 'lesson/student/saveVisitorInfo',
      clearVisitorInfo: 'lesson/student/clearVisitorInfo',
      uploadVisitorLearnRecords: 'lesson/student/uploadVisitorLearnRecords'
    }),
    resetUrl() {
      const { path } = this.$route
      let href = this.$router.resolve({ path }).href
      window.location.href = href
    }
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'lesson/student/lessonDetail',
      lessonQuizDone: 'lesson/student/lessonQuizDone',
      isShowSummary: 'lesson/student/isShowSummary',
      userinfo: 'lesson/userinfo',
      enterClassInfo: 'lesson/student/enterClassInfo'
    }),
    currentClassroomId() {
      return _.get(this.userinfo, 'extra.classroomId', '')
    },
    lesson() {
      return this.lessonDetail.modList || []
    },
    userId() {
      return _.get(this.userinfo, 'id', '')
    },
    lessonHeaderData() {
      return this.lessonDetail.lesson || {}
    },
    lessonName() {
      return this.lessonHeaderData.lessonName || 'KeepWork'
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
.add-package-confirm {
  &.icon-BOOK:before {
    font-size: 100px;
    color: #909399;
  }
}
</style>

