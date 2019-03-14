<template>
  <div class="org-teacher-teach" v-if="!isLoading">
    <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" v-model="selectedClassId"></org-classes-tabbar>
    <div class="package-count">
      包含: <span class="package-count-number">{{orgClassesCount}}个班级</span>
    </div>
    <el-row>
      <el-col class="org-pacakge-list" :sm="12" :md="8" :xs="24" v-for="(pacakge,index) in packageList" :key="index">
        <org-package-cell-by-time></org-package-cell-by-time>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import OrgPackageCellByTime from '../common/OrgPackageCellByTime'
import OrgClassesTabbar from '../common/OrgClassesTabbar'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'OrgTeacherTeach',
  components: {
    OrgPackageCellByTime,
    OrgClassesTabbar
  },
  data() {
    return {
      packageList: [1, 2, 3, 4, 5],
      selectedClassId: '',
      isLoading: true
    }
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

<style lang="scss">
.org-teacher-teach {
  .package-count {
    color: #909399;
    margin-top: 20px;
    font-size: 14px;
    &-number {
      margin-left: 7px;
      color: #303133;
    }
  }
}
</style>

