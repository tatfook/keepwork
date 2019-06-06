<template>
  <div class="org-package-cell-for-student">
    <org-package-cell class="org-package-cell-reset" :packageData="packageData" @package-click="handlePackageclick"></org-package-cell>
    <div class="org-package-status">
      <el-progress :percentage="learnedLessonPercent" color="#64f78a" :show-text="false"></el-progress>
      <div class="org-package-status-text">{{packageStatusText}}</div>
      <el-button v-if="isCompleteStatus" :disabled="true" type="info" class="org-package-status-button" >已结业</el-button>
      <el-button v-else-if="isStartStatus" @click="handleStartLearn" class="org-package-status-button start-button">{{$t('org.startToLearn')}}</el-button>
      <el-button v-else-if="isContinueStatus" @click="handleContinueLearn" class="org-package-status-button continue-button">{{$t('org.continue')}}</el-button>
      <div v-else-if="isFinishStatus" class="finish-status"> <i class="el-icon-circle-check finish-status-icon"></i> {{$t('org.finished')}}</div>
    </div>
  </div>
</template>

<script>
import OrgPackageCell from './OrgPackageCell'
import { mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'OrgPackageCellForStudent',
  components: {
    OrgPackageCell
  },
  props: {
    packageData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    handlePackageclick() {
      this.$emit('package-click', this.packageId)
    },
    handleContinueLearn() {
      if (this.isBeInClassroom) {
        return this.$message({
          type: 'warning',
          message: this.$t('lesson.beInClass')
        })
      }
      this.$emit('continue-click', this.packageId)
    },
    handleStartLearn() {
      if (this.isBeInClassroom) {
        return this.$message({
          type: 'warning',
          message: this.$t('lesson.beInClass')
        })
      }
      this.$emit('start-click', this.packageId)
    }
  },
  computed: {
    ...mapGetters({
      isBeInClassroom: 'org/student/isBeInClassroom'
    }),
    packageId() {
      return _.get(this.packageData, 'packageId', '')
    },
    packageLessons() {
      return _.get(this.packageData, 'lessons', [])
    },
    packageClassInfo() {
      return _.get(this.packageData, 'lessonOrganizationClasses', {})
    },
    packageLessonCount() {
      return this.packageLessons.length
    },
    packageLearnedLessonCount() {
      return _.filter(this.packageLessons, item => item.isLearned).length
    },
    learnedLessonPercent() {
      if (this.packageLessonCount === this.packageLearnedLessonCount) {
        return 100
      }
      return _.multiply(
        _.divide(this.packageLearnedLessonCount, this.packageLessonCount),
        100
      )
    },
    isStartStatus() {
      return this.learnedLessonPercent === 0
    },
    isContinueStatus() {
      return !(this.isFinishStatus && this.learnedLessonPercent)
    },
    isFinishStatus() {
      return this.learnedLessonPercent === 100
    },
    isCompleteStatus() {
      return +new Date(this.packageClassInfo.end) < Date.now()
    },
    packageStatusText() {
      if (this.isStartStatus) {
        return this.$t('org.notYetStarted')
      }
      if (this.isContinueStatus) {
        return this.$t('org.learnedLessonsCount', {
          packageCount: this.packageLearnedLessonCount
        })
      }
      return this.$t('org.learnedFinished')
    }
  }
}
</script>

<style lang="scss" scoped>
.org-package-cell-for-student {
  width: 288px;
  box-sizing: border-box;
  cursor: pointer;
  margin-top: 10px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  overflow: hidden;
  &:hover {
    box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.16);
    transition: all 200ms ease-in;
  }
  .org-package-cell-reset {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .org-package-status {
    background: #fff;
    border-top: solid 1px #e8e8e8;
    padding: 16px;
    box-sizing: border-box;
    .finish-status {
      height: 40px;
      line-height: 40px;
      text-align: center;
      width: 100%;
      color: #62f78a;
      font-size: 16px;
      &-icon {
        font-size: 20px;
      }
    }
    &-text {
      font-size: 12px;
      color: #303133;
      height: 26px;
      margin-top: 4px;
    }

    &-button {
      width: 100%;
      &.continue-button {
        color: #2397f3;
        border-radius: 4px;
        border: solid 1px #2397f3;
      }
      &.start-button {
        background: #2397f3;
        color: #fff;
      }
    }
  }
}
</style>
