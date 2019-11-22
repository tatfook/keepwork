<template>
  <org-teacher-report-comment v-if="!loading" :isEditMod="true" :formData="this.userReport"></org-teacher-report-comment>
</template>

<script>
import OrgTeacherReportComment from './OrgTeacherReportComment'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgTeacherReportCommentEdit',
  components: {
    OrgTeacherReportComment
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
    })
  },
  computed: {
    ...mapGetters({
      evaluationReportCommentDetail: 'org/teacher/evaluationReportCommentDetail'
    }),
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
    userReport() {
      return _.get(this.evaluationReportCommentDetail, 'userRepo', {})
    }
  }
}
</script>
