<template>
  <div class="student-evaluations">
    <div class="student-evaluations-header">
      我的评估报告
      <div class="student-evaluations-header-back" @click="goBack">
        返回 &gt;
      </div>
    </div>
    <div class="student-evaluations-main">
      <div v-if="isNoReport" class="no-report">
        暂无评估报告
      </div>
      <el-tabs v-else class="student-evaluations-tabs" v-model="activeName" type="card">
        <el-tab-pane label="数据统计" name="statics">
          <report-chart v-if="!loading && activeName === 'statics'" :reportData="reportData" class="student-evaluations-report" :showThisTimeRadar="false" :reportType="2" :showReportTypeName="false" :showUserInfo="false" :showComment="false" :showFooter="false"></report-chart>
        </el-tab-pane>
        <el-tab-pane label="历次点评详情" name="comments">
          <comment-list></comment-list>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import ReportChart from '@/components/org/common/ReportChart'
import CommentList from './common/CommentList'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'StudentEvaluations',
  data() {
    return {
      activeName: 'statics',
      loading: true
    }
  },
  async created() {
    try {
      this.activeName = this.queryActiveName
      await Promise.all([
        this.orgGetEvaluationCommentList({ classId: this.classId }),
        this.getEvaluationReportStatistics(this.classId)
      ])
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  },
  watch: {
    activeName(active) {
      this.$router.push({
        query: {
          active
        }
      })
    }
  },
  methods: {
    ...mapActions({
      getEvaluationReportStatistics:
        'org/student/getEvaluationReportStatistics',
      orgGetEvaluationCommentList: 'org/student/getEvaluationCommentList'
    }),
    goBack() {
      this.$router.push({
        name: 'OrgStudentClassDetail',
        params: {
          classId: this.classId
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      classReportStatistics: 'org/student/classReportStatistics',
      getEvaluationCommentListByClassId:
        'org/student/getEvaluationCommentListByClassId'
    }),
    evaluationCommentList() {
      return this.getEvaluationCommentListByClassId({ classId: this.classId })
    },
    isNoReport() {
      return _.get(this.evaluationCommentList, 'length', 0) === 0
    },
    classId() {
      return _.get(this.$route, 'params.classId', '')
    },
    reportData() {
      return _.get(this.classReportStatistics, [this.classId], {})
    },
    queryActiveName() {
      return _.get(this.$route, 'query.active', 'statics')
    }
  },
  components: {
    CommentList,
    ReportChart
  }
}
</script>
<style lang="scss" scoped>
.student-evaluations {
  min-height: 420px;
  &-header {
    background-color: #fff;
    height: 60px;
    padding: 0 24px;
    font-size: 16px;
    line-height: 60px;
    border-bottom: 1px solid #e8e8e8;
    &-back {
      float: right;
      color: #999;
      cursor: pointer;
    }
  }
  &-main {
    padding: 24px;
    background: #fff;
    .no-report {
      color: #999;
      text-align: center;
      height: 335px;
      line-height: 165px;
    }
  }
  &-report {
    margin-top: 47px;
    /deep/.report-chart-container {
      border-radius: 6px;
    }
  }
}
</style>
