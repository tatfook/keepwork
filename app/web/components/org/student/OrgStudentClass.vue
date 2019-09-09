<template>
  <div class="org-student-class" v-if="!isLoading">
    <div class="org-student-class-header">
      <span class="join-classroom-icon"></span>
      <span class="join-classroom-title">{{$t("lesson.enterClass")}}</span>
      <el-input :placeholder="$t('org.pleaseInputClassIdOrLessonId')" class="join-classroom-input" v-model.trim="classroomkey"></el-input>
      <el-button @click="handleEnterClassroom" size="small" type="primary" :disabled="!isCanEnterClassroom">{{$t("lesson.enter")}}</el-button>
    </div>
    <div class="org-student-class-count">
      {{$t('lesson.include')}}: <span class="org-student-class-count-number">{{orgPackageCount + $t('lesson.packagesCount')}}</span>
    </div>
    <div class="org-student-class-main">
    </div>
    <el-row>
      <el-col class="org-pacakge-list" :sm="12" :md="8" :xs="24" v-for="(packageData,index) in orgStudentPackageList" :key="index">
        <org-package-cell :packageData="packageData" @package-click="handleToPackagePage" @start-click="handleStartLearn" @continue-click="handleContinueLearn"></org-package-cell>
      </el-col>
    </el-row>
    <el-dialog title="" center :visible.sync="beInClassDialog" width="30%">
      <div class="hint">
        <i class="el-icon-warning redIcon"></i>{{$t('lesson.beInClass')}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="backCurrentClass">{{$t('lesson.resumeOldClass')}}</el-button>
        <el-button type="primary" @click="enterNewClass(classroomkey)">{{$t('lesson.enterNewClass')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import OrgPackageCell from '@/components/org/common/OrgPackageCell'
import { lesson } from '@/api'
import _ from 'lodash'
export default {
  name: 'OrgStudentClass',
  components: {
    OrgPackageCell
  },
  data() {
    return {
      isLoading: true,
      classroomkey: '',
      beInClassDialog: false
    }
  },
  async created() {
    try {
      await this.getOrgPackages()
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    ...mapActions({
      getOrgPackages: 'org/student/getOrgPackages',
      enterClassroom: 'org/student/enterClassroom',
      getOrgPackageDetail: 'org/student/getOrgPackageDetail',
      getNextLesson: 'org/student/getNextLesson'
    }),
    handleToPackagePage(packageId) {
      this.$router.push({
        name: 'OrgStudentPackage',
        params: { packageId }
      })
    },
    async handleContinueLearn(packageId) {
      const { lessonId } = await this.getNextLesson(packageId)
      if (packageId && lessonId) {
        this.toLearnConfirm(packageId, lessonId, {
          name: 'OrgStudentPackageLesson',
          params: { packageId, lessonId }
        })
      } else {
        this.$message.error(this.$t('common.failure'))
      }
    },
    async handleStartLearn(packageId) {
      const packageDetail = await this.getOrgPackageDetail({ packageId })
      const lessonId = _.get(packageDetail, 'lessons.[0].lesson.id', '')
      if (packageId && lessonId) {
        this.toLearnConfirm(packageId, lessonId, {
          name: 'OrgStudentPackageLesson',
          params: { packageId, lessonId }
        })
      } else {
        this.$message.error(this.$t('common.failure'))
      }
    },
    async toLearnConfirm(_packageId, _lessonId, routerObject) {
      let res = await lesson.lessons
        .getLastLearnRecords()
        .catch(e => console.error(e))
      let lastLearnRecods = _.get(res, 'rows', [])
      if (lastLearnRecods.length === 0) {
        return this.$router.push(routerObject)
      }
      if (lastLearnRecods[0].state === 1) {
        return this.$router.push(routerObject)
      }

      const { packageId, lessonId } = lastLearnRecods[0]
      if (_packageId === packageId && _lessonId === lessonId) {
        return this.$router.push(routerObject)
      }
      this.$confirm(this.$t('lesson.learnLessonConfirm'), '', {
        confirmButtonText: this.$t('common.Yes'),
        cancelButtonText: this.$t('common.No'),
        type: 'warning'
      })
        .then(() => this.$router.push(routerObject))
        .catch(e => console.error(e))
    },
    async handleEnterClassroom() {
      try {
        const key = _.lowerCase(this.classroomkey)
        if (_.includes(key, 'x')) {
          if (this.isBeInClassroom) {
            return this.$message.error(this.$t('lesson.beInClass'))
          }
          const [packageId, lessonId] = key.split('x').map(_.toNumber)
          const OrgHasTheLesson = _.get(
            this.orgPackagesDict,
            [packageId],
            []
          ).includes(lessonId)
          const res = await lesson.classrooms.isValidLessonId({
            packageId,
            lessonId
          })
          const isHasTheLesson = res.count > 0
          if (isHasTheLesson && OrgHasTheLesson) {
            this.$router.push({
              name: 'OrgStudentPackageLesson',
              params: { packageId, lessonId }
            })
          }
          if (isHasTheLesson && !OrgHasTheLesson) {
            this.$message.error(this.$t('org.haveNotBoughtLesson'))
          }
          if (!isHasTheLesson) {
            this.$message.error(this.$t('org.classIdNotExist'))
          }
          return
        }
      } catch (error) {
        console.error(error)
      }
    },
    backCurrentClass() {
      const { packageId, lessonId } = this.classroom
      this.$router.push({
        name: 'OrgStudentPackageLesson',
        params: { packageId, lessonId }
      })
    },
    async enterNewClass(classroomkey) {
      const key = _.trim(_.replace(_.lowerCase(classroomkey), 'c', ''))
      const res = await lesson.classrooms.isValidKey(key)
      if (res == true) {
        const classInfo = await this.enterClassroom({ key })
          .then(classInfo => {
            const { packageId, lessonId } = classInfo
            if (packageId && lessonId) {
              this.$router.push({
                name: 'OrgStudentPackageLesson',
                params: { packageId, lessonId }
              })
            }
            this.beInClassDialog = false
          })
          .catch(e => {
            if (e.response.data.indexOf('不是该班级学生') !== -1) {
              this.$message({
                showClose: true,
                message: this.$t('你不是该班级的学生'),
                type: 'error'
              })
            } else {
              this.$message({
                showClose: true,
                message: this.$t('common.failure'),
                type: 'error'
              })
            }
          })
      } else {
        this.$message({
          showClose: true,
          message: this.$t('lesson.wrongKey'),
          type: 'error'
        })
      }
    }
  },
  computed: {
    ...mapGetters({
      orgPackages: 'org/student/orgPackages',
      isBeInClassroom: 'org/student/isBeInClassroom',
      classroom: 'org/student/classroom'
    }),
    orgPackageList() {
      return _.map(this.orgPackages, item => ({ ...item, ...item.package }))
    },
    orgStudentPackageList() {
      const _studentPackages = _.filter(
        this.orgPackageList,
        item =>
          (_.get(item, 'lessonOrganizationClassMembers.roleId', 0) & 1) > 0
      )
      const today = Date.now()
      const expirationList = _.filter(
        _studentPackages,
        item => +new Date(item.lessonOrganizationClasses.end) < today
      )
      const studentPackages = _.filter(
        _studentPackages,
        item => +new Date(item.lessonOrganizationClasses.end) > today
      )
      const learnedList = _.filter(studentPackages, item =>
        _.some(item.lessons, lesson => lesson.isLearned)
      )
      const noLearnedList = _.filter(studentPackages, item =>
        _.every(item.lessons, lesson => !lesson.isLearned)
      )
      const isDoneList = _.filter(studentPackages, item =>
        _.every(item.lessons, lesson => lesson.isLearned)
      )
      const isDoneIDS = _.map(isDoneList, item => item.id)
      const haveNotLearnedList = _.filter(
        learnedList,
        item => !_.includes(isDoneIDS, item.id)
      )
      const result = _.concat(
        haveNotLearnedList,
        noLearnedList,
        isDoneList,
        expirationList
      )
      return result
    },
    orgPackageCount() {
      return this.orgStudentPackageList.length
    },
    orgPackagesDict() {
      return _.reduce(
        this.orgStudentPackageList,
        (obj, cur) => {
          const { packageId, lessons = [] } = cur
          obj[packageId] = _.map(lessons, item => item.lessonId)
          return obj
        },
        {}
      )
    },
    isCanEnterClassroom() {
      return Boolean(this.classroomkey)
    },
    currentClassroomKey() {
      return _.get(this.classroom, 'key', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.org-student-class {
  &-header {
    height: 64px;
    display: flex;
    align-items: center;
    background: #fff;
    box-sizing: border-box;
    padding-left: 24px;
    border-radius: 8px;
    .join-classroom {
      &-icon {
        display: inline-block;
        width: 59px;
        height: 48px;
        background: url('../../../assets/org/mortarboard.png') no-repeat;
        margin-right: 10px;
      }
      &-input {
        width: 300px;
        margin: 0 10px;
        /deep/ .el-input__inner {
          height: 32px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
      }
    }
  }

  &-count {
    height: 40px;
    line-height: 40px;
    color: #909399;
    margin-top: 10px;
    font-size: 14px;
    &-number {
      color: #303133;
    }
  }
}
</style>

