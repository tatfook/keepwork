<template>
  <div class="org-teacher-class-package-lesson" v-if="!isLoading">
    <div class="org-breadcrumb">
      <div class="org-breadcrumb-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'OrgTeacher' }">{{$t("org.TeachLabel")}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'OrgTeacher' }">{{currentClassName}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'OrgTeacherClassPackage', params: { packageId } }">{{packageName}}</el-breadcrumb-item>
          <el-breadcrumb-item>
            <el-dropdown @command="handleSelectLesson">
              <span class="el-dropdown-link">
                {{currentLessonName}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in currentPackageLessons" :command="item.lessonId" :key="item.lessonId">{{item.lessonName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <lesson-header class='lesson-header' :lesson="lessonHeader" :isTeacher="true" :isInCurrentClass="isInCurrentClass" />
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonHeader from '../common/OrgLessonHeader'
import { lesson } from '@/api'
export default {
  name: 'OrgTeacherClassPacakgeLesson',
  components: {
    LessonHeader
  },
  data() {
    return {
      _interval: null,
      isLoading: true
    }
  },
  watch: {
    async $route(rotue) {
      await this.getLessonData()
    }
  },
  async created() {
    await this.getLessonData()
  },
  async destroyed() {
    this.leaveTheClassroom()
  },
  methods: {
    ...mapActions({
      getLessonDetail: 'org/teacher/getLessonDetail',
      getOrgClasses: 'org/teacher/getOrgClasses',
      leaveTheClassroom: 'org/teacher/leaveTheClassroom'
    }),
    async getLessonData() {
      try {
        const {
          name,
          params: { classId, packageId, lessonId }
        } = this.$route
        if (!this.isBeInClass && name !== 'OrgTeacherLessonPlan') {
          this.$router.push({ name: 'OrgTeacherLessonPlan' })
        }
        await Promise.all([
          this.getLessonDetail({ classId, packageId, lessonId }),
          this.getOrgClasses({ cache: true })
        ])

        window.document.title = this.currentLessonName
      } catch (error) {
        console.error(error)
      }
      this.isLoading = false
    },
    handleSelectLesson(_lessonId) {
      const { packageId, lessonId } = this.$route.params
      if (lessonId != _lessonId) {
        this.leaveTheClassroom()
        this.$router.push({
          name: 'OrgTeacherLessonPlan',
          params: { packageId, lessonId: _lessonId }
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'org/teacher/orgLessonDetail',
      orgClassPackagesDetail: 'org/teacher/orgClassPackagesDetail',
      orgClasses: 'org/teacher/orgClasses',
      isBeInClass: 'org/teacher/isBeInClass',
      isClassIsOver: 'org/teacher/isClassIsOver',
      classroom: 'org/teacher/classroom',
      userinfo: 'org/userinfo'
    }),
    currentClassName() {
      return _.get(
        _.find(this.orgClasses, item => item.id === this.classId),
        'name',
        ''
      )
    },
    currentPackageLessons() {
      return _.map(_.get(this.packageDetail, 'lessons', []), item => ({
        ...item,
        ...item.lesson
      }))
    },
    isInCurrentClass() {
      const { classId: cid, packageId: pid, lessonId: lid } = this.$route.params
      const { classId, packageId, lessonId } = this.classroom
      let flag = classId == cid && packageId == pid && lessonId == lid
      return this.isBeInClass ? flag : true
    },
    packageName() {
      return _.get(this.packageDetail, ['package', 'packageName'], '')
    },
    packageDetail() {
      return _.get(
        this.orgClassPackagesDetail,
        [this.classId, this.packageId],
        {}
      )
    },
    packageId() {
      return _.toNumber(_.get(this.$route, ['params', 'packageId'], ''))
    },
    classId() {
      return _.toNumber(_.get(this.$route, ['params', 'classId'], ''))
    },
    lesson() {
      return this.lessonDetail.modList || []
    },
    lessonHeader() {
      return this.lessonDetail.lesson
    },
    currentLessonName() {
      return _.get(this.lessonHeader, 'lessonName', 'Keepwork')
    },
    lessonMain() {
      return this.lesson.filter(({ cmd }) => cmd !== 'Lesson')
    },
    userId() {
      return _.get(this.userinfo, 'id', '')
    }
  },
  beforeRouteUpdate({ name }, from, next) {
    if (name === 'LessonTeacherSummary' && !this.isClassIsOver) {
      return this.$router.push({ name: 'plan' })
    }
    if (name === 'LessonTeacherPerformance' && !this.isBeInClass) {
      this.intervalUpdateLearnRecords()
      return this.$router.push({ name: 'plan' })
    }
    next()
  }
}
</script>

<style lang="scss">
.org-teacher-class-package-lesson {
  counter-reset: no;
  padding-bottom: 20px;
  .org-breadcrumb {
    background: #fff;
    color: #999;
    border-bottom: solid 1px #e6e6e6;
    &-main {
      max-width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      padding-left: 20px;
      .el-breadcrumb {
        height: 58px;
        line-height: 58px;
      }
      .el-dropdown-link {
        cursor: pointer;
      }
    }
  }
}

.quiz-no::after {
  content: counter(no);
  counter-increment: no;
}
@media print {
  .lesson-header {
    display: none;
  }
}
</style>

