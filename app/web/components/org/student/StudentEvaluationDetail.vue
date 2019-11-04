<template>
  <div class="student-evaluation-detail">
    <div class="student-evaluation-detail-header">
      <div>
        <span class="my-report">
          我的评估报告 <i class="el-icon-arrow-right"></i>
        </span>
        <span class="comment-list">
          历次点评详情 <i class="el-icon-arrow-right"></i>
        </span>
        <span class="report-name">
          {{reportName}}
        </span>
      </div>
      <div class="student-evaluation-detail-header-back" @click="handleBack">
        返回 <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div class="student-evaluation-detail-report-chart">
      <report-chart v-if="!loading" :reportType="type" :reportData="evaluationReportCommentDetail"></report-chart>
    </div>
  </div>
</template>

<script>
import ReportChart from '@/components/org/common/ReportChart'
import { mapActions, mapGtters, mapGetters } from 'vuex'
export default {
  name: 'StudentEvaluationDetail',
  components: {
    ReportChart
  },
  data() {
    return {
      loading: true
    }
  },
  async created() {
    try {
      await this.getEvaluationReportCommentDetail(this.params)
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    ...mapActions({
      getEvaluationReportCommentDetail:
        'org/student/getEvaluationReportCommentDetail'
    }),
    handleBack() {
      this.$router.push({
        name: 'OrgStudentEvaluations',
        query: {
          active: 'comments'
        }
      })
    }
  },
  computed: {
    ...mapGetters({
      evaluationReportCommentDetail:
        'org/student/evaluationReportCommentDetail',
      userinfo: 'org/userinfo'
    }),
    userReportId() {
      return _.get(this.$route, 'query.userReportId', '')
    },
    studentId() {
      return this.userinfo.id
    },
    type() {
      return _.toNumber(_.get(this.$route, 'query.type', ''))
    },
    classId() {
      return _.toNumber(_.get(this.$route, 'query.classId', ''))
    },
    reportName() {
      return _.get(this.$route, 'query.reportName', '')
    },
    params() {
      return {
        userReportId: this.userReportId,
        classId: this.classId,
        type: this.type,
        studentId: this.studentId
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.student-evaluation-detail {
  background: #fff;
  margin-bottom: 30px;
  &-header {
    height: 57px;
    line-height: 57px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 24px;
    &-back {
      cursor: pointer;
      color: #999;
    }
    .my-report {
      color: #999;
    }
    .comment-list {
      color: #999;
    }
    .report-name {
      color: #333;
    }
  }

  &-report-chart {
    margin: 40px 0;
  }
}
</style>

