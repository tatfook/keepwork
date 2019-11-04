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
    if (this.isNeedRedirect) {
      await this.handleSwitchClass(this.selectedClassId)
    }
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/teacher/getOrgClasses',
      getClassEvaluationReportList: 'org/teacher/getClassEvaluationReportList'
    }),
    async handleSwitchClass(classId) {
      this.selectedClassId = classId
      this.$router.push({ name: 'OrgTeacherReportList', query: { classId } })
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
    },
    isNeedRedirect() {
      return ['OrgTeacherReports'].includes(this.$route.name)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>