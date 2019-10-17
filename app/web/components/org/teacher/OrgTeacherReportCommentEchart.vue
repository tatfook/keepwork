<template>
  <div>
    echart
  </div>
</template>

<script>
import ReportEchart from './ReportEchart'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgTeacherReportCommentEchart',
  async created() {
    const res = await this.getEvaluationReportCommentDetail(this.params)
    console.log(res)
  },
  methods: {
    ...mapActions({
      getEvaluationReportCommentDetail:
        'org/teacher/getEvaluationReportCommentDetail'
    })
  },
  computed: {
    ...mapGetters({
      evaluationReportCommentDetail: 'org/teacher/evaluationReportCommentDetail'
    }),
    studentId() {
      return _.get(this.$route, 'query.studentId')
    },
    params() {
      return {
        studentId: this.studentId,
        reportId: this.reportId,
        classId: this.classId,
        type: this.reportTypeId
      }
    },
    studentId() {
      return _.toNumber(this.$route.query.studentId, '')
    },
    reportId() {
      return _.toNumber(this.$route.query.reportId)
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