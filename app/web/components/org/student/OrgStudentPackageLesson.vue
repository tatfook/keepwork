<template>
  <div class="org-student-class-package-lesson">
    <div class="org-breadcrumb">
      <div class="org-breadcrumb-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'OrgStudent' }">{{$t("org.lessonPackage")}}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'OrgStudentPackage', params: { packageId } }">{{packageName}}</el-breadcrumb-item>
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
        <div v-if="isNextButtonShow" class="org-breadcrumb-next-button" @click="toNextLesson">{{$t("org.toNextLesson")}}</div>
      </div>
    </div>
    <lesson-header class='lesson-header' :lesson="lessonHeader" />
    <org-student-lesson-content></org-student-lesson-content>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import OrgStudentLessonContent from './OrgStudentLessonContent'
import LessonHeader from '../common/OrgLessonHeader'
import { lesson } from '@/api'
import _ from 'lodash'

export default {
  name: 'OrgStudentPackageLesson',
  components: {
    LessonHeader,
    OrgStudentLessonContent
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
  async destroyed() {
    window.document.title = 'Keepwork'
  },
  methods: {
    ...mapActions({
      getLessonDetail: 'org/student/getLessonDetail',
      getOrgPackageDetail: 'org/student/getOrgPackageDetail'
    }),
    toNextLesson() {
      let nextLessonId = this.currentPackageLessons[
        this.currentLessonInPackageIndex + 1
      ].id
      this.$router.push({
        name: 'OrgStudentPackageLesson',
        params: { lessonId: nextLessonId }
      })
    },
    async getLessonData() {
      try {
        const { params } = this.$route
        const packageId = _.toNumber(params.packageId)
        const lessonId = _.toNumber(params.lessonId)
        await Promise.all([
          this.getLessonDetail({ packageId, lessonId }),
          this.getOrgPackageDetail({ packageId })
        ])
        window.document.title = this.currentLessonName
      } catch (error) {
        console.error(error)
      } finally {
        this.isLoading = false
      }
    },
    handleSelectLesson(lessonId) {
      const { name, params } = this.$route
      this.$router.push({ name, params: { ...params, lessonId } })
    }
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'org/student/orgLessonDetail',
      orgPackagesDetail: 'org/student/orgPackagesDetail',
      orgClasses: 'org/student/orgClasses',
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
      const lessons = _.sortBy(
        _.get(this.packageDetail, 'lessons', []),
        item => item.lessonNo
      )
      return _.map(lessons, item => ({
        ...item,
        ...item.lesson
      }))
    },
    packageName() {
      return _.get(this.packageDetail, ['package', 'packageName'], '')
    },
    packageDetail() {
      return _.get(this.orgPackagesDetail, [this.packageId], {})
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
    currentLessonInPackageIndex() {
      let currentLessonId = _.get(this.lessonHeader, 'id')
      return _.findIndex(this.currentPackageLessons, { id: currentLessonId })
    },
    isNextButtonShow() {
      let currentPackageLessonsLen = this.currentPackageLessons.length
      return (
        currentPackageLessonsLen > 1 &&
        this.currentLessonInPackageIndex < currentPackageLessonsLen - 1
      )
    },
    lessonMain() {
      return this.lesson.filter(({ cmd }) => cmd !== 'Lesson')
    },
    userId() {
      return _.get(this.userinfo, 'id', '')
    },
    classroomId() {
      return _.get(this.classroom, 'id', '')
    }
  }
}
</script>

<style lang="scss">
.org-student-class-package-lesson {
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
      display: flex;
      align-items: center;
      .el-breadcrumb {
        flex: 1;
        height: 58px;
        line-height: 58px;
      }
      .el-dropdown-link {
        cursor: pointer;
      }
    }
    &-next-button {
      height: 34px;
      line-height: 34px;
      color: #409efe;
      border: 1px solid;
      border-radius: 4px;
      cursor: pointer;
      padding: 0 24px;
      font-size: 14px;
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

