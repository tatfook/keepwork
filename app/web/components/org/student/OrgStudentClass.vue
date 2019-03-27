<template>
  <div class="org-student-class" v-if="!isLoading">
    <div class="org-student-class-header">
      <span class="join-classroom-icon"></span>
      <span class="join-classroom-title">快速进入课堂</span>
      <el-input placeholder="请输入课堂ID或课程ID" class="join-classroom-input" v-model.trim="classroomkey"></el-input>
      <el-button @click="handleEnterClassroom" size="small" type="primary" :disabled="!isCanEnterClassroom">进入</el-button>
    </div>
    <div class="org-student-class-count">
      共有：<span class="org-student-class-count-number">{{orgPackageCount}}个课程包</span>
    </div>
    <div class="org-student-class-main">
    </div>
    <el-row>
      <el-col class="org-pacakge-list" :sm="12" :md="8" :xs="24" v-for="(packageData,index) in orgPackageList" :key="index">
        <org-package-cell-for-student :packageData="packageData" @package-click="handleToPackagePage" @start-click="handleStartLearn" @continue-click="handleContinueLearn"></org-package-cell-for-student>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import OrgPackageCellForStudent from '../common/OrgPackageCellForStudent'
import { lesson } from '@/api'
import _ from 'lodash'
export default {
  name: 'OrgStudentClass',
  components: {
    OrgPackageCellForStudent
  },
  data() {
    return {
      isLoading: true,
      classroomkey: ''
    }
  },
  async created() {
    try {
      await this.getOrgPackages()
    } catch (error) {
      console.error(error)
    }
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      getOrgPackages: 'org/student/getOrgPackages',
      enterClassroom: 'org/student/enterClassroom',
      getOrgPackageDetail: 'org/student/getOrgPackageDetail'
    }),
    handleToPackagePage(packageId) {
      this.$router.push({
        name: 'OrgStudentPackage',
        params: { packageId }
      })
    },
    async handleContinueLearn(packageId) {
      const packageDetail = await this.getOrgPackageDetail({ packageId })
      const lessons = _.get(packageDetail, 'lessons', [])
      const { lessonId } = _.find(lessons, item => !item.isLearned)
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
          const [packageId, lessonId] = key.split('x').map(_.toNumber)
          if (packageId && lessonId) {
            // 这里可以再做个效验
            this.$router.push({
              name: 'OrgStudentLessonContent',
              params: { packageId, lessonId }
            })
          }
        } else {
          // join the classrom
          const _key = _.trim(key.replace('c', ''))
          const classInfo = await this.enterClassroom({ key: _key })
          const { packageId, lessonId } = classInfo
          if (packageId && lessonId) {
            this.$router.push({
              name: 'OrgStudentLessonContent',
              params: { packageId, lessonId }
            })
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
  },
  computed: {
    ...mapGetters({
      orgPackages: 'org/student/orgPackages',
      isBeInClassroom: 'org/student/isBeInClassroom'
    }),
    orgPackageList() {
      return _.map(this.orgPackages, item => ({ ...item, ...item.package }))
    },
    orgPackageCount() {
      return this.orgPackages.length
    },
    isCanEnterClassroom() {
      return this.classroomkey
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

