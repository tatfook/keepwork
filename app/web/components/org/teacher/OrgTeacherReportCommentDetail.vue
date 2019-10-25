<template>
  <div class="teacher-report-comment-detail">
    <div class="teacher-report-comment-detail-header">
      <span>
        <span class="teacher-report-comment-detail-header-report-name" @click="handleToReportDetail">
          {{reportName}}</span> <i class="el-icon-arrow-right"></i> 点评内容
      </span>
      <span>
        <el-button @click="handleToCommentEdit" size="small">编辑</el-button>
        <el-button @click="handleToPrint" size="small" type="primary">打印</el-button>
      </span>
    </div>
    <report-chart class="student-report-detail" v-if="!loading" :reportData="evaluationReportCommentDetail" :reportType="reportType"></report-chart>
  </div>
</template>

<script>
import ReportChart from '@/components/org/common/ReportChart'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgTeacherReportCommentDetail',
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
        'org/teacher/getEvaluationReportCommentDetail'
    }),
    handleToReportDetail() {
      this.$router.push({
        name: 'OrgTeacherReportDetail',
        query: {
          classId: this.classId,
          reportName: this.reportName,
          reportId: this.reportId,
          type: this.reportType
        }
      })
    },
    handleToCommentEdit() {
      this.$router.push({
        name: 'OrgTeacherReportCommentEdit',
        query: {
          ...this.params,
          reportName: this.reportName,
          reportId: this.reportId
        }
      })
    },
    handleToPrint() {
      const URL = this.$router.resolve({
        name: 'OrgPrint',
        query: this.$route.query
      }).href
      window.open(URL, '_blank')
    }
  },
  computed: {
    ...mapGetters({
      evaluationReportCommentDetail: 'org/teacher/evaluationReportCommentDetail'
    }),
    reportName() {
      return _.get(this.$route, 'query.reportName', '')
    },
    params() {
      return {
        studentId: this.studentId,
        userReportId: this.userReportId,
        classId: this.classId,
        type: this.reportType
      }
    },
    studentId() {
      return _.toNumber(this.$route.query.studentId, '')
    },
    userReportId() {
      return _.toNumber(this.$route.query.userReportId)
    },
    classId() {
      return _.toNumber(this.$route.query.classId)
    },
    reportType() {
      return _.toNumber(this.$route.query.type)
    },
    reportId() {
      return _.toNumber(this.$route.query.reportId)
    }
  }
}
</script>
<style lang="scss" scoped>
.teacher-report-comment-detail {
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 0 24px;
    height: 57px;
    border-top: 1px solid #e8e8e8;
    border-bottom: 1px solid #e8e8e8;
    color: #333;
    &-report-name {
      color: #999;
      cursor: pointer;
    }
  }
  .student-report-detail {
    padding: 40px 0;
    margin-bottom: 40px;
  }
}
</style>