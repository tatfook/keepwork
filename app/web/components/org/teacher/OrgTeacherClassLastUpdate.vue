<template>
  <div class="org-teacher-last-update">
    <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" v-model="selectedClassId"></org-classes-tabbar>
    <div class="org-teacher-last-update-separator">
      <span>
        {{ currentClassName }} <i class="el-icon-arrow-right"></i> <span class="org-teacher-last-update-separator-bold">最新更新</span>
      </span>
      <router-link class="org-teacher-last-update-separator-back" :to="{ name: 'OrgTeacherClass', query: { classId: selectedClassId } }">
        返回 <i class="el-icon-arrow-right"></i>
      </router-link>
    </div>
    <div class="org-teacher-last-update-proejcts">
      <last-update-row class="org-teacher-last-update-proejcts-item" v-for="item in lastUpdateList" :key="item.memberId" :userData="item"></last-update-row>
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
    this.initData()
  },
  watch: {
    async $route(route) {
      this.initData()
    }
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/teacher/getOrgClasses',
      getMoreLastUpdateProjects: 'org/teacher/getMoreLastUpdateProjects'
    }),
    sortByUpdate(arr) {
      return _.sortBy(
        arr,
        item => -+new Date(_.get(item, 'projects[0].updatedAt', ''))
      )
    },
    handleSwitchClass(classId) {
      this.selectedClassId = classId
      this.$router.push({ query: { classId } })
    },
    async initData() {
      await this.getOrgClasses()
      this.selectedClassId = _.defaultTo(
        _.toNumber(this.$route.query.classId),
        this.firstClassId
      )
      await this.getMoreLastUpdateProjects(this.selectedClassId)
    }
  },
  computed: {
    ...mapGetters({
      orgClasses: 'org/teacher/orgClasses',
      moreLastUpdateProjects: 'org/teacher/moreLastUpdateProjects'
    }),
    lastUpdateList() {
      let studentList = _.filter(
        this.moreLastUpdateProjects,
        item => item.roleId & 1
      )
      studentList = _.map(studentList, item => {
        const users = item.users
        item.projects = _.map(item.projects, item => ({ ...item, user: users }))
        return item
      })
      const groups = _.groupBy(studentList, item =>
        item.projects.length ? 1 : 0
      )
      const SORT = [1, 0]
      const arr = _.map(SORT, i => {
        return this.sortByUpdate(_.get(groups, [i], []))
      })
      return _.flatten(arr)
    },
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
  &-proejcts {
    &-item {
      margin-bottom: 16px;
    }
  }
}
</style>