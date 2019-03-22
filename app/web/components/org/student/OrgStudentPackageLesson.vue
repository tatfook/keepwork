<template>
  <div class="org-student-class-package-lesson" v-if="!isLoading">
    <org-header></org-header>
    <div class="org-breadcrumb">
      <div class="org-breadcrumb-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'OrgStudent' }">课程包</el-breadcrumb-item>
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
      </div>
    </div>
    <lesson-header class='lesson-header' :lesson="lessonHeader" :isstudent="true" :isInCurrentClass="isInCurrentClass" @intervalUpdateLearnRecords="intervalUpdateLearnRecords" @clearUpdateLearnRecords="clearUpdateLearnRecords" />
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonHeader from '../common/OrgLessonHeader'
import OrgHeader from '../common/OrgHeader'
import { lesson } from '@/api'
import _ from 'lodash'

export default {
  name: 'OrgStudentPackageLesson',
  components: {
    LessonHeader,
    OrgHeader
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

    // await this.getCurrentClass().catch(e => console.error(e))
    // if (
    //   name === 'LessonstudentSummary' ||
    //   (name === 'LessonstudentPerformance' && !this.isBeInClass) ||
    //   !this.isInCurrentClass
    // ) {
    //   this.$router.push({ name: 'LessonstudentPlan' })
    // }
    // if (this.isInCurrentClass) {
    //   this.copyClassroomQuiz()
    //   this.intervalUpdateLearnRecords()
    // }
    // window.document.title = this.currentLessonName
  },
  async destroyed() {
    // this.clearUpdateLearnRecords()
    // this.leaveTheClassroom()
    window.document.title = 'Keepwork'
  },
  methods: {
    ...mapActions({
      getLessonDetail: 'org/student/getLessonDetail',
      getOrgPackageDetail: 'org/student/getOrgPackageDetail',
      createLearnRecords: 'org/student/createLearnRecords',
      resumeLearnRecordsId: 'org/student/resumeLearnRecordsId',
      resumeQuiz: 'org/student/resumeQuiz'
      // getCurrentClass: 'org/student/getCurrentClass',
      // updateLearnRecords: 'org/student/updateLearnRecords',
      // leaveTheClassroom: 'org/student/leaveTheClassroom',
      // copyClassroomQuiz: 'org/student/copyClassroomQuiz'
    }),
    async getLessonData() {
      try {
        const { name, params } = this.$route
        const packageId = _.toNumber(params.packageId)
        const lessonId = _.toNumber(params.lessonId)
        // if (name !== 'OrgstudentLessonPlan') {
        //   this.$router.push({ name: 'OrgstudentLessonPlan' })
        // }
        await Promise.all([
          this.getLessonDetail({ packageId, lessonId }),
          this.getOrgPackageDetail({ packageId })
        ])
        this.initSelfLearning({ packageId, lessonId})
        // const learnRecords = await lesson.lessons.getLastLearnRecords()
        // const lastRecord = _.get(learnRecords, 'rows.[0]', {})
        // if (
        //   lastRecord.state === 0 &&
        //   lastRecord.packageId === packageId &&
        //   lastRecord.lessonId === lessonId
        // ) {
        //   const quizzes = _.get(lastRecord, 'extra.quiz', [])
        //   if (_.some(quizzes, item => item.answer)) {
        //     this.resumeQuiz({ learnRecords: lastRecord })
        //   }
        // }
        // await this.createLearnRecords({ packageId, lessonId })

        window.document.title = this.currentLessonName
      } catch (error) {
        console.error(error)
      }
      this.isLoading = false
    },
    async initSelfLearning({ packageId, lessonId }) {
      const learnRecords = await lesson.lessons.getLastLearnRecords()
      const lastRecord = _.get(learnRecords, 'rows.[0]', {})
      if (
        lastRecord.state === 0 &&
        lastRecord.packageId === packageId &&
        lastRecord.lessonId === lessonId
      ) {
        const quizzes = _.get(lastRecord, 'extra.quiz', [])
        if (_.some(quizzes, item => item.answer)) {
          this.resumeQuiz({ learnRecords: lastRecord })
        }
      }else {
       await this.createLearnRecords({ packageId, lessonId })
      }
    },
    async intervalUpdateLearnRecords(delay = 3000) {
      // await this.updateLearnRecords()
      // clearTimeout(this._interval)
      // this._interval = setTimeout(
      //   () => this.intervalUpdateLearnRecords(),
      //   delay
      // )
    },
    async clearUpdateLearnRecords() {
      // clearTimeout(this._interval)
      // await this.updateLearnRecords()
    },
    handleSelectLesson(lessonId) {
      // FIXME: 效验是否正在学习
      const { name, params } = this.$route
      this.$router.push({ name, params: { ...params, lessonId } })
    }
  },
  computed: {
    ...mapGetters({
      // isShowLesson: 'lesson/student/isShowLesson',
      // isShowPerformance: 'lesson/student/isShowPerformance',
      // isShowSummary: 'lesson/student/isShowSummary',
      lessonDetail: 'org/student/orgLessonDetail',
      orgPackagesDetail: 'org/student/orgPackagesDetail',
      orgClasses: 'org/student/orgClasses',
      isBeInclassroom: 'org/student/isBeInclassroom'
      // isBeInClass: 'lesson/student/isBeInClass',
      // isClassIsOver: 'lesson/student/isClassIsOver',
      // classroom: 'lesson/student/classroom',
      // userinfo: 'lesson/userinfo',
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
      // const { packageId: pid, lessonId: lid } = this.$route.params
      // const { packageId, lessonId } = this.classroom
      // let flag = packageId == pid && lessonId == lid
      // return this.isBeInClass ? flag : true
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
    }
  },
  beforeRouteUpdate({ name }, from, next) {
    if (name === 'LessonstudentSummary' && !this.isClassIsOver) {
      return this.$router.push({ name: 'plan' })
    }
    if (name === 'LessonstudentPerformance' && !this.isBeInClass) {
      this.intervalUpdateLearnRecords()
      return this.$router.push({ name: 'plan' })
    }
    next()
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

