<template>
  <div class="teacher-report">
    <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" :disabled="disabledTabbar" v-model="selectedClassId"></org-classes-tabbar>
    <router-view></router-view>
  </div>
</template>

<script>
import OrgClassesTabbar from '@/components/org/common/OrgClassesTabbar'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgTeacherReports',
  components: {
    OrgClassesTabbar
  },
  data() {
    return {
      selectedClassId: ''
    }
  },
  async created() {
    await this.getOrgClasses()
    this.selectedClassId = _.defaultTo(
      _.toNumber(this.$route.query.classId),
      this.firstClassId
    )
    this.$router.push({
      name: 'OrgTeacherReportComment',
      query: { classId: this.selectedClassId }
    })
  },
  watch: {
    $route(route) {
      const classId = _.toNumber(route.query.classId)
      this.initClassData(classId)
    }
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/teacher/getOrgClasses'
    }),
    handleSwitchClass(classId) {
      this.selectedClassId = classId
      this.$router.push({ name: 'OrgTeacherReportEmpty', query: { classId } })
    },
    handleEvaluationReport() {
      this.$message.info('evaluationReports ')
    },
    initClassData(classId) {
      console.log(classId)
    }
  },
  computed: {
    ...mapGetters({
      orgClasses: 'org/teacher/orgClasses'
    }),
    firstClassId() {
      return _.get(this.orgClasses, '[0].id', '')
    },
    disabledTabbar() {
      return ['OrgTeacherReportComment'].includes(this.$route.name)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>