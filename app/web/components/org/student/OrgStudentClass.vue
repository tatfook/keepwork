<template>
  <div class="org-student-class" v-if="!isLoading">
    <div class="org-student-class-header">
      <span class="join-classroom-icon"></span>
      <span class="join-classroom-title">快速进入课堂</span>
      <el-input placeholder="请输入课堂ID或课程id" class="join-classroom-input"></el-input>
      <el-button size="small" type="primary">进入</el-button>
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
import _ from 'lodash'
export default {
  name: 'OrgStudentClass',
    components: {
    OrgPackageCellForStudent
  },
  data() {
    return {
      isLoading: true
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
      getOrgPackages: 'org/student/getOrgPackages'
    }),
    handleToPackagePage(pacakgeId) {
      console.log(pacakgeId)
    },
    handleContinueLearn(pacakgeId) {
      console.log(pacakgeId)
      console.log('handleContinueLearn')
    },
    handleStartLearn(pacakgeId) {
      console.log(pacakgeId)
      console.log('handleStartLearn')
    }
  },
  computed: {
    ...mapGetters({
      orgPackages: 'org/student/orgPackages'
    }),
    orgPackageList() {
      return _.map(this.orgPackages, item => ({ ...item, ...item.package }))
    },
    orgPackageCount() {
      return this.orgPackages.length
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

