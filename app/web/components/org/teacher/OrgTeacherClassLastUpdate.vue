<template>
  <div class="org-teacher-last-update">
    <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" v-model="selectedClassId"></org-classes-tabbar>
    <div class="org-teacher-last-update-separator">
      <span>
        {{ currentClassName }} <i class="el-icon-arrow-right"></i> <span class="org-teacher-last-update-separator-bold">最新更新</span>
      </span>
      <router-link class="org-teacher-last-update-separator-back" :to="{ name: 'OrgTeacherClass' }">
        返回 <i class="el-icon-arrow-right"></i>
      </router-link>
    </div>
  </div>
</template>

<script>
import OrgClassesTabbar from '@/components/org/common/OrgClassesTabbar'
import LastUpdateRow from '@/components/org/common/LastUpdateRow'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'OrgTeacherLastUpdate',
  components: {
    OrgClassesTabbar,
    LastUpdateRow
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
    // await this.getClassLastUpdateProjects(this.selectedClassId)
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/teacher/getOrgClasses',
      getClassLastUpdateProjects: 'org/teacher/getClassLastUpdateProjects'
    }),
    handleSwitchClass(classId) {
      this.selectedClassId = classId
      this.$router.push({ query: { classId } })
    }
  },
  computed: {
    ...mapGetters({
      orgClasses: 'org/teacher/orgClasses'
    }),
    firstClassId() {
      return _.get(this.orgClasses, '[0].id', '')
    },
    currentClassName() {
      const obj = _.find(
        this.orgClasses,
        item => item.id === this.selectedClassId
      )
      return _.get(obj, 'name', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.org-teacher-last-update {
  &-separator {
    height: 70px;
    line-height: 70px;
    color: #999;
    display: flex;
    justify-content: space-between;
    &-bold {
      color: #333;
    }
    &-back {
      color: #999;
      text-decoration: none;
    }
  }
}
</style>