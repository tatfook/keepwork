<template>
  <div class="lesson-operations">
    <span v-if="url && !isStudent" @click="onToLessonPlan" class="lesson-operations-item">教案</span>
    <span v-if="coursewareUrl" @click="onToLessonCourseware" class="lesson-operations-item">课件</span>
    <span v-if="teacherVideoUrl && !isStudent" @click="onShowTeacherVideo" class="lesson-operations-item">教师视频</span>
    <span v-if="studentVideoUrl" @click="onShowStudentVideo" class="lesson-operations-item">{{isStudent?'':'学生'}}视频</span>
    <el-dialog custom-class="lesson-operations-dialog" :visible.sync="isShowTeacherVideo">
      <video-player v-if="isShowTeacherVideo" :src="teacherVideoUrl"></video-player>
    </el-dialog>
    <el-dialog custom-class="lesson-operations-dialog" :visible.sync="isShowStudentVideo">
      <video-player v-if="isShowStudentVideo" :src="studentVideoUrl"></video-player>
    </el-dialog>
  </div>
</template>
<script>
import videoPlayer from '@/components/common/VideoPlayer'
export default {
  name: 'LessonOperations',
  components: {
    videoPlayer
  },
  props: {
    lesson: Object,
    isStudent: {
      type: Boolean,
      default: false
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    previewToken: String
  },
  data() {
    return {
      isShowTeacherVideo: false,
      isShowStudentVideo: false
    }
  },
  computed: {
    url() {
      return _.get(this.lesson, 'url')
    },
    coursewareUrl() {
      return _.get(this.lesson, 'coursewareUrl')
    },
    teacherVideoUrl() {
      return _.get(this.lesson, 'teacherVideoUrl')
    },
    studentVideoUrl() {
      return _.get(this.lesson, 'studentVideoUrl')
    },
    lessonID() {
      return _.get(this.lesson, 'id')
    },
    currentRouteName() {
      return this.$route.name
    },
    currentPackageID() {
      return _.get(this.$route, 'params.packageId')
    },
    isAdminRouter() {
      return /Admin/gi.test(this.currentRouteName)
    },
    isTeacherRouter() {
      return /Teacher/gi.test(this.currentRouteName)
    },
    isStudentRouter() {
      return /Student/gi.test(this.currentRouteName)
    },
    nextRouteParams() {
      return {
        packageId: this.currentPackageID,
        lessonId: this.lessonID
      }
    }
  },
  methods: {
    onToLessonPlan() {
      if (this.isPreview) {
        this.$router.push({
          name: 'LessonPreview',
          params: {
            lessonId: this.lessonID
          },
          query: {
            token: this.previewToken
          }
        })
        return
      }
      if (this.isAdminRouter) {
        this.$router.push({
          name: 'OrgAdminLessonPlan',
          params: this.nextRouteParams
        })
        return
      }
      if (this.isTeacherRouter) {
        this.$router.push({
          name: 'OrgTeacherLessonPlan',
          params: this.nextRouteParams
        })
        return
      }
    },
    onToLessonCourseware() {
      if (this.isPreview) {
        this.$router.push({
          name: 'LessonPreviewCourseware',
          params: {
            lessonId: this.lessonID
          },
          query: {
            token: this.previewToken
          }
        })
        return
      }

      if (this.isTeacherRouter) {
        this.$router.push({
          name: 'OrgTeacherCourseware',
          params: this.nextRouteParams
        })
        return
      }
      if (this.isAdminRouter) {
        this.$router.push({
          name: 'OrgAdminCourseware',
          params: this.nextRouteParams
        })
        return
      }
      if (this.isStudentRouter) {
        const classId = _.get(this.$route, 'query.classId', '')
        const param = {
          name: 'OrgStudentPackageLesson',
          params: this.nextRouteParams
        }
        if (classId) {
          param['query'] = { classId }
        }
        this.$router.push(param)
        return
      }
    },
    onShowTeacherVideo() {
      this.isShowTeacherVideo = true
    },
    onShowStudentVideo() {
      this.isShowStudentVideo = true
    }
  }
}
</script>
<style lang="scss" scoped>
.lesson-operations {
  span {
    text-decoration: none;
    padding: 6px 12px;
    color: #606266;
    border: 1px solid #909399;
    border-radius: 4px;
    display: inline-block;
    margin-right: 8px;
    cursor: pointer;
    &:hover {
      color: #fff;
      border-color: #2397f3;
      background-color: #2397f3;
    }
  }
  /deep/ &-dialog {
    .el-dialog__header {
      padding: 30px 20px 30px;
      background: #000;
      .el-dialog__headerbtn {
        font-size: 30px;
        color: #fff;
      }
    }
    .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
