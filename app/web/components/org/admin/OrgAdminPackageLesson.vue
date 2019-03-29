<template>
  <div class="org-adin-package-lesson" v-if="!isLoading">
    <div class="org-breadcrumb">
      <div class="org-breadcrumb-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'OrgPackages'}">课程包</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'OrgAdminPackageDetail', params: { packageId } }">{{packageName}}</el-breadcrumb-item>
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
        <org-lesson-header :isTeacher="true" :isInCurrentClass="false"></org-lesson-header>
        <org-admin-lesson-content></org-admin-lesson-content>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import OrgLessonHeader from '../common/OrgLessonHeader'
import OrgAdminLessonContent from './OrgAdminLessonContent'
import { lesson } from '@/api'
import _ from 'lodash'

export default {
  name: 'OrgAdminPackageLesson',
  components: {
    OrgLessonHeader,
    OrgAdminLessonContent
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
      getLessonDetail: 'org/getLessonDetail',
      getOrgPackageDetail: 'org/getOrgPackageDetail'
    }),
    async getLessonData() {
      try {
        const { name, params } = this.$route
        const packageId = _.toNumber(params.packageId)
        const lessonId = _.toNumber(params.lessonId)
        await Promise.all([
          this.getLessonDetail({ packageId, lessonId }),
          this.getOrgPackageDetail({ packageId })
        ])
        window.document.title = this.currentLessonName
      } catch (error) {
        console.error(error)
      }
      this.isLoading = false
    },
    handleSelectLesson(lessonId) {
      const { name, params } = this.$route
      this.$router.push({ name, params: { ...params, lessonId } })
    }
  },
  computed: {
    ...mapGetters({
      lessonDetail: 'org/orgLessonDetail',
      orgPackagesDetail: 'org/orgPackagesDetail',
      userinfo: 'org/userinfo'
    }),
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
.org-adin-package-lesson {
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

