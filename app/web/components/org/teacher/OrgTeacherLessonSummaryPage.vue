<template>
  <div class="org-teacher-lesson-summary-page">
    <div class="org-breadcrumb">
      <div class="org-breadcrumb-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'OrgTeacherStatistics' }">{{org.DataStaticsLabel}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <org-teacher-lesson-summary />
  </div>
</template>

<script>
import OrgTeacherLessonSummary from './OrgTeacherLessonSummary'
export default {
  name: 'OrgTeacherLessonSummaryPage',
  components: {
    OrgTeacherLessonSummary
  }
}
</script>

<style lang="scss">
.org-teacher-lesson-summary-page {
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
        cursor: pointer;
        .el-breadcrumb__inner {
          cursor: pointer;
        }
      }
      /deep/.el-dropdown-link {
        cursor: pointer;
      }
    }
  }
}

@media print {
  .org-breadcrumb {
    display: none;
  }
}
</style>
