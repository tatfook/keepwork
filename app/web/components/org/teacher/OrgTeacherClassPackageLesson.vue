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
    <lesson-header class='lesson-header' :lesson="lessonHeader" :isTeacher="true" />
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
  methods: {
    ...mapActions({
      getLessonDetail: 'org/teacher/getLessonDetail',
      getOrgClasses: 'org/teacher/getOrgClasses',
    }),
    async getLessonData() {
      try {
        const {
          name,
          params: { classId, packageId, lessonId }
        } = this.$route
        await Promise.all([
          this.getLessonDetail({ classId, packageId, lessonId }),
          this.getOrgClasses({ cache: true })
        ])

        window.document.title = this.currentLessonName
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    handleSelectLesson(_lessonId) {
      const {
        name,
        params: { packageId, lessonId }
      } = this.$route
      if (lessonId != _lessonId) {
        this.$router.push({
          name,
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
  .org-teacher-class-package-lesson {
    .org-breadcrumb {
      display: none;
    }
  }
}
</style>

