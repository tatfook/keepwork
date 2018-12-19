<template>
  <div class="study-page-header">
    <div class="study-page-header-menu">
      <div class="study-page-header-menu-left">
        <span
          @click="goToSpecialColumn"
          :class="['study-page-header-menu-left-button', { 'selected': activeIndex === 1 }]"
        >{{$t('lesson.myDesk')}}</span>
        <span
          @click="goToLessonsCenter"
          :class="['study-page-header-menu-left-button', { 'selected': activeIndex === 2 }]"
        >{{$t('lesson.allLessons')}}</span>
      </div>
      <div class="study-page-header-menu-right">
        <el-dropdown
          class="study-page-header-menu-right-dropdown"
          @command="getSolution"
        >
          <span :class="['el-dropdown-link', { 'selected': activeIndex === 3}]">
            {{$t("lesson.solutions")}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="teachingIdea">{{$t("lesson.ourIdeas")}}</el-dropdown-item>
            <el-dropdown-item command="teacher">{{$t("lesson.forEducations")}}</el-dropdown-item>
            <el-dropdown-item command="parents">{{$t("lesson.forLearners")}}</el-dropdown-item>
            <el-dropdown-item command="organization">{{$t("lesson.partnership")}}</el-dropdown-item>
            <el-dropdown-item command="competition">{{$t("lesson.worksAndContests")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown
          class="study-page-header-menu-right-dropdown"
          @command="hanldOperation"
        >
          <span :class="['el-dropdown-link', { 'selected': activeIndex === 4}]">
            {{$t("lesson.resources")}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="teaching-video">{{$t("lesson.videos")}}</el-dropdown-item>
            <el-dropdown-item command="download">{{$t("lesson.paracraftDownload")}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span
          class="study-page-header-menu-right-link"
          @click="switchIdentity"
        >{{toggleButtonText}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import LoginDialog from '@/components/common/LoginDialog'

const StudentPageReg = /^\/student/
const TeacherPageReg = /^\/teacher/
const AboutActivePageNameReg = /^(TeacherAbout|StudentAbout)$/
const LessonsActivePageNameReg = /^(TeacherCenter|StudentCenter)$/
const ColumnActivePageNameReg = /^(TeacherColumn|StudentColumn)+/
const LEARN_CNETER_TAG = ['TeacherColumn', 'TeacherColumnReview', 'TeacherColumnLessonManager', 'TeacherColumnPackageManager', 'TeacherColumnEditPackage', 'LearningCenterPackages', 'OfflineGuidanceCourse', 'TeachingVideo', 'SharedCourseLecturer']
const ALL_LESSON_TAG = ['StudentCenter', 'TeacherCenter']
const SOLUTION_TAG = ['StudentSolution', 'TeacherSolution']
const VIDEO_TAG = ['TeacherAllTeachingVideo', 'StudentAllTeachingVideo']
export default {
  name: 'Header',
  data() {
    return {
      activeIndex: 0
    }
  },
  watch: {
    $route(to) {
      const { name } = to
      if (LEARN_CNETER_TAG.some(i => i === name)) {
        return this.activeIndex = 1
      }
      if (ALL_LESSON_TAG.some(i => i === name)) {
        return this.activeIndex = 2
      }
      if (SOLUTION_TAG.some(i => i === name)) {
        return this.activeIndex = 3
      }
      if (VIDEO_TAG.some(i => i === name)) {
        return this.activeIndex = 4
      }
      this.activeIndex = 0
    }
  },
  computed: {
    ...mapGetters({
      userIsLogined: 'user/isLogined'
    }),
    isLogin() {
      return this.userIsLogined
    },
    nowFullPath() {
      return this.$route.fullPath
    },
    nowPagename() {
      return this.$route.name
    },
    activeNavType() {
      let type
      if (this.nowPagename === 'Lesson') {
        type = 'lessons'
      } else {
        type = AboutActivePageNameReg.test(this.nowPagename)
          ? 'about'
          : LessonsActivePageNameReg.test(this.nowPagename)
            ? 'lessons'
            : ColumnActivePageNameReg.test(this.nowPagename)
              ? 'column'
              : ''
      }
      return type
    },
    isTeacherPage() {
      return TeacherPageReg.test(this.nowFullPath)
    },
    isStudentPage() {
      return !this.isTeacherPage
    },
    columnText() {
      if (this.isStudentPage) {
        return this.$t('lesson.studentColumn')
      }
      if (this.isTeacherPage) {
        return this.$t('lesson.teacherColumn')
      }
    },
    statusTogglePath() {
      return this.isTeacherPage ? '/student' : '/teacher'
    },
    currentPath() {
      return this.isTeacherPage ? '/teacher' : '/student'
    },
    toggleButtonText() {
      if (this.isStudentPage) {
        return this.$t('lesson.viewTeacherPage')
      }
      if (this.isTeacherPage) {
        return this.$t('lesson.viewStudentPage')
      }
    }
  },
  components: {
    LoginDialog
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'lesson/toggleLoginDialog'
    }),
    getSolution(command) {
      this.$router.push({
        path: `${this.currentPath}/solution/${command}`
      })
    },
    hanldOperation(command) {
      switch (command) {
        case 'teaching-video':
          return this.$router.push({
            path: `${this.currentPath}/allteachingvideo/animate`
          })
          break
        case 'download':
          window.open('http://paracraft.keepwork.com/download?lang=zh')
          break
        default:
          break
      }
    },
    switchIdentity() {
      if (!this.userIsLogined) {
        return this.toggleLoginDialog({ show: true })
      }
      let _page = this.$router.resolve({ path: this.statusTogglePath })
      window.open(_page.href, '_blank')
    },
    goToAboutUs() {
      this.isStudentPage
        ? this.$router.push(`/student/about`)
        : this.$router.push(`/teacher/about`)
    },
    goToLessonsCenter() {
      this.isStudentPage
        ? this.$router.push(`/student/center`)
        : this.$router.push(`/teacher/center`)
    },
    goToSpecialColumn() {
      this.isStudentPage
        ? this.$router.push(`/student`)
        : this.$router.push(`/teacher`)
    }
  }
}
</script>



<style lang="scss">
.study-page-header {
  border-bottom: 1px solid #eee;
  &-menu {
    margin: 0 auto;
    max-width: 1200px;
    height: 87px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-left {
      &-button {
        padding: 8px 25px;
        color: #909399;
        font-size: 14px;
        background: #f5f5f5;
        border-radius: 4px;
        border: solid 1px #e8e8e8;
        cursor: pointer;
        margin-right: 20px;
        &:hover {
          background: #4db5ff;
          color: #ffffff;
        }
        &.selected {
          background: #409efe;
          color: #ffffff;
        }
      }
    }
    &-right {
      &-dropdown {
        margin-right: 70px;
        cursor: pointer;
        .el-dropdown-link {
          &.selected {
            color: #409efe;
          }
        }
      }
      &-link {
        color: #409efe;
        font-size: 16px;
        cursor: pointer;
        &:hover {
          color: #4db5ff;
        }
        &.selected {
          color: #409efe;
        }
      }
    }
    .el-row {
      margin-right: 0 !important;
      margin-left: 0 !important;
    }
  }
}

@media (max-width: 768px) {
  .study-page-header {
    margin: 0;
    &-menu {
      height: 50px;
      padding: 10px;
      flex-direction: column;
      align-items: flex-start;
      &-left-button {
        margin-right: 0px;
        font-size: 14px;
        padding: 4px 8px;
      }
      &-right {
        &-dropdown {
          margin-right: 0px;
        }
        &-link {
          font-size: 14px;
        }
      }
    }
  }
}

</style>

