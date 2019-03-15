<template>
  <div class="org-teacher-classes">
    <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" v-model="selectedClassId"></org-classes-tabbar>
    <div class="org-teacher-classes-students">
      <div class="students-table-header"></div>
    </div>
  </div>
</template>

<script>
import OrgClassesTabbar from '../common/OrgClassesTabbar'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgTeacherClass',
  components: {
    OrgClassesTabbar
  },
  async created() {
    await this.getOrgClasses()
    this.selectedClassId = this.firstOrgClassId
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/teacher/getOrgClasses'
    }),
    async handleSwitchClass(id) {
      this.selectedClassId = id
    }
  },
  computed: {
    ...mapGetters({
      orgClasses: 'org/teacher/orgClasses'
    }),
    firstOrgClassId() {
      return _.get(this.orgClasses, '[0].id', '')
    },
    orgClassesCount() {
      return _.get(this.orgClasses, 'length', 0)
    }
  }
}
</script>
