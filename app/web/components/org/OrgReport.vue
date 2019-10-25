<template>
  <report-chart class="org-report-chart" v-if="!loading" :reportData="evaluationReportCommentDetail" @completed="completed" :reportType="reportType"></report-chart>
</template>

<script>
import ReportChart from '@/components/org/common/ReportChart'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgReport',
  components: {
    ReportChart
  },
  data() {
    return {
      loading: true,
      currentTabVisibility: false,
      reportCompleted: false,
      printed: false
    }
  },
  async mounted() {
    try {
      await this.getEvaluationReportCommentDetail(this.query)
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
    completed(flag) {
      console.log('completed')
      this.reportCompleted = true
    }
  },
  computed: {
    ...mapGetters({
      evaluationReportCommentDetail: 'org/teacher/evaluationReportCommentDetail'
    }),
    query() {
      return this.$route.query
    },
    reportType() {
      return _.toNumber(this.query.type)
    }
  }
}
</script>