<template>
  <div class="lesson-header">
    <div class="lesson-header-nav">
      <div class="lesson-header-nav-box">
        <div @click="goToAboutUs" class="lesson-header-nav-item" :class="{'active': activeNavType === 'about'}">
          {{$t('lesson.aboutUs')}}
        </div>
        <div @click="goToLessonsCenter" class="lesson-header-nav-item" :class="{'active': activeNavType === 'lessons'}">
          {{$t('lesson.lessonsCenter')}}
        </div>
        <div @click="goToSpecialColumn" class="lesson-header-nav-item" :class="{'active': activeNavType === 'column'}">
          {{columnText}}
        </div>
      </div>
      <router-link class="lesson-header-toggle-button" target='_blank' :to="statusTogglePath">{{toggleButtonText}}</router-link>
    </div>

  </div>
</template>
<script>
import _ from 'lodash'

const StudentPageReg = /^\/student/
const TeacherPageReg = /^\/teacher/
const AboutActivePageNameReg = /^(TeacherAbout|StudentAbout)$/
const LessonsActivePageNameReg = /^(TeacherCenter|StudentCenter)$/
const ColumnActivePageNameReg = /^(TeacherColumn|StudentColumn)*/
export default {
  name: 'Header',
  computed: {
    nowFullPath() {
      return this.$route.fullPath
    },
    nowPagename() {
      return this.$route.name
    },
    activeNavType() {
      let type
      type = AboutActivePageNameReg.test(this.nowPagename)
        ? 'about'
        : LessonsActivePageNameReg.test(this.nowPagename)
          ? 'lessons'
          : ColumnActivePageNameReg.test(this.nowPagename) ? 'column' : ''
      return type
    },
    isTeacherPage() {
      return TeacherPageReg.test(this.nowFullPath)
    },
    isStudentPage() {
      return StudentPageReg.test(this.nowFullPath)
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
      let targetPath = ''
      if (this.isTeacherPage) {
        targetPath = _.replace(this.nowFullPath, /^\/teacher/, '/student')
      } else {
        targetPath = _.replace(this.nowFullPath, /^\/student/, '/teacher')
      }
      return {
        path: targetPath
      }
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
  methods: {
    goToAboutUs() {
      if (this.isStudentPage) {
        this.$router.push({
          path: `/student/about`
        })
      } else {
        this.$router.push({
          path: `/teacher/about`
        })
      }
    },
    goToLessonsCenter() {
      if (this.isStudentPage) {
        this.$router.push({
          path: `/student/center`
        })
      } else {
        this.$router.push({
          path: `/teacher/center`
        })
      }
    },
    goToSpecialColumn() {
      if (this.isStudentPage) {
        this.$router.push({
          path: `/student`
        })
      } else {
        this.$router.push({
          path: `/teacher`
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.lesson-header {
  background-color: #fff;
  border-bottom: 2px solid #bfbfbf;
  padding: 14px 0;
  &-nav {
    max-width: 1150px;
    margin: 0 auto;
    position: relative;
    &-box {
      text-align: center;
    }
    &-item {
      display: inline-block;
      margin: 0 32px;
      cursor: pointer;
      border-radius: 34px;
      padding: 6px 18px;
    }
    &-item.active,
    &-item:hover {
      background-color: #409efe;
      color: #fff;
      box-shadow: 0 4px 6px 0 rgba(42, 102, 164, 0.38);
    }
  }
  &-toggle-button {
    padding: 11px;
    position: absolute;
    top: 0;
    right: 0;
    border: 1px solid;
    color: #409efe;
    border-radius: 4px;
    font-size: 12px;
    text-decoration: none;
  }
}
@media (max-width: 1200px) {
  .lesson-header {
    &-toggle-button {
      right: 15px;
    }
  }
}
@media (max-width: 768px) {
  .lesson-header {
    &-nav {
      &-box {
        text-align: left;
      }
      &-item {
        margin: 0;
        font-size: 14px;
        padding: 6px 10px;
      }
    }
  }
}
</style>

