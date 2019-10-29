<template>
  <div>
    <radar-echart></radar-echart>
  </div>
</template>

<script>
import RadarChart from '@/components/org/common/RadarChart'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgTeacherReportCommentChart',
  components: {
    RadarChart
  },
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
        type: this.reportType
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
    reportType() {
      return _.toNumber(this.$route.query.type)
    }
  }
}
</script>