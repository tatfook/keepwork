<template>
  <div class="teacher-report-comment-detail">
    <div class="teacher-report-comment-detail-header">
      <span>
        <span class="report-name">
          {{reportName}}</span> <i class="el-icon-arrow-right"></i> 点评内容
      </span>
      <span>
        <el-button @click="handleToCommentEdit" size="small">编辑</el-button>
        <el-button size="small" type="primary">打印</el-button>
      </span>
    </div>
    <report-echart></report-echart>
  </div>
</template>

<script>
import ReportEchart from './ReportEchart'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgTeacherReportCommentDetail',
  components: {
    ReportEchart
  },
  async created() {
    await this.getEvaluationReportCommentDetail(this.params)
  },
  watch: {
    async $route(route) {
      await this.getEvaluationReportCommentDetail(this.params)
    }
  },
  methods: {
    ...mapActions({
      getEvaluationReportCommentDetail:
        'org/teacher/getEvaluationReportCommentDetail'
    }),
    handleToCommentEdit() {
      this.$router.push({
        name: 'OrgTeacherReportCommentEdit',
        query: { ...this.params, reportName: this.reportName }
      })
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
        type: this.reportTypeId
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
    reportTypeId() {
      return _.toNumber(this.$route.query.type)
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
    .report-name {
      color: #999;
    }
  }
}
</style>