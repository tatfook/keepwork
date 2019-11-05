<template>
  <report-chart v-if="!loading" :printMode="true" :reportData="evaluationReportCommentDetail" @completed="completed" :reportType="reportType"></report-chart>
</template>

<script>
import ReportChart from '@/components/org/common/ReportChart'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgPrint',
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
      document.addEventListener('visibilitychange', this.monitorTab)
      this.currentTabVisibility = !document.hidden
    } catch (error) {
      console.error(error)
    } finally {
      this.loading = false
    }
  },
  destroyed() {
    document.removeEventListener('visibilitychange', this.monitorTab)
  },
  watch: {
    canPrint(value) {
      if (value) {
        this.printReport()
      }
    }
  },
  methods: {
    ...mapActions({
      getEvaluationReportCommentDetail:
        'org/teacher/getEvaluationReportCommentDetail'
    }),
    monitorTab() {
      this.currentTabVisibility = !document.hidden
    },
    completed(flag) {
      this.reportCompleted = true
    },
    async printReport() {
      this.printed = true
      this.$nextTick(() =>
        setTimeout(() => {
          window.print()
        }, 1200)
      )
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
    },
    canPrint() {
      return this.reportCompleted && this.currentTabVisibility && !this.printed
    }
  }
}
</script>