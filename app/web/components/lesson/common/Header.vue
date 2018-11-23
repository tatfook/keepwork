<template>
  <div class="study-page-header">
    <div class="study-page-header-menu">
      <div class="study-page-header-menu-lef">
        <span @click="toLearnCenter" class="study-page-header-menu-left-button">学习中心</span>
        <span @click="toLessonCenter" class="study-page-header-menu-left-button">全部课程</span>
      </div>
      <div class="study-page-header-menu-right">
        <el-dropdown class="study-page-header-menu-right-dropdown">
          <span class="el-dropdown-link">
            解决方案<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>教学理念</el-dropdown-item>
            <el-dropdown-item>学校教师</el-dropdown-item>
            <el-dropdown-item>学生家长</el-dropdown-item>
            <el-dropdown-item>机构合作</el-dropdown-item>
            <el-dropdown-item>作品和创意大赛</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown class="study-page-header-menu-right-dropdown">
          <span class="el-dropdown-link">
            学习资源<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>教学视频</el-dropdown-item>
            <el-dropdown-item>Paracraft下载</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span class="study-page-header-menu-right-link" @click="switchIdentity">{{toggleButtonText}}</span>
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
export default {
  name: 'Header',
  data() {
    return {}
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
      // return StudentPageReg.test(this.nowFullPath)
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
    toggleButtonText() {
      if (this.isStudentPage) {
        return this.$t('lesson.viewTeacherPage')
      }
      if (this.isTeacherPage) {
        return this.$t('lesson.viewStudentPage')
      }
      return '默认值'
    }
  },
  components: {
    LoginDialog
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'lesson/toggleLoginDialog'
    }),
    toLearnCenter() {
      alert('学习中心')
    },
    toLessonCenter() {},
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
<style lang="scss" scoped>
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


<style lang="scss">
.study-page-header {
  border: none !important;
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
          background: #2397f3;
          color: #ffffff;
        }
      }
    }
    &-right {
      &-dropdown {
        margin-right: 70px;
        cursor: pointer;
      }
      &-link {
        color: #2397f3;
        font-size: 16px;
        cursor: pointer;
        &:hover {
          color: #4db5ff;
        }
        &.selected {
          color: #4db5ff;
        }
      }
    }
    .el-row {
      margin-right: 0 !important;
      margin-left: 0 !important;
    }
  }
}

// .lesson-header {
//   background-color: #fff;
//   border-bottom: 2px solid #bfbfbf;
//   padding: 14px 0;
//   &-nav {
//     max-width: 1150px;
//     margin: 0 auto;
//     position: relative;
//     &-box {
//       text-align: center;
//     }
//     &-item {
//       display: inline-block;
//       margin: 0 32px;
//       cursor: pointer;
//       border-radius: 34px;
//       padding: 6px 18px;
//     }
//     &-item.active,
//     &-item:hover {
//       background-color: #409efe;
//       color: #fff;
//       box-shadow: 0 4px 6px 0 rgba(42, 102, 164, 0.38);
//     }
//   }
//   &-toggle-button {
//     padding: 11px;
//     position: absolute;
//     top: 0;
//     right: 0;
//     border: 1px solid;
//     color: #409efe;
//     border-radius: 4px;
//     font-size: 12px;
//     text-decoration: none;
//   }
// }
// @media (max-width: 1200px) {
//   .lesson-header {
//     &-toggle-button {
//       right: 15px;
//     }
//   }
// }
// @media (max-width: 768px) {
//   .lesson-header {
//     &-nav {
//       &-box {
//         text-align: left;
//       }
//       &-item {
//         margin: 0;
//         font-size: 14px;
//         padding: 6px 10px;
//       }
//     }
//   }
// }
// @media print {
//   .lesson-header {
//     display: none;
//   }
// }
</style>

