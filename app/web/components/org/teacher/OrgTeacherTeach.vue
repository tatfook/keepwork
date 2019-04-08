<template>
  <div class="org-teacher-teach">
    <template v-if="!isLoading">
      <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" v-model="selectedClassId"></org-classes-tabbar>
      <div class="package-count">
        {{$t('org.includes')}} <span class="package-count-number">{{selectedClassPackagesCount}}{{$t('org.packagesCount')}}</span>
      </div>
      <el-row>
        <el-col class="org-pacakge-list" :sm="12" :md="8" :xs="24" v-for="(packageData,index) in selectedClassPackgesSort" :key="index">
          <org-package-cell-by-time :packageData="packageData" @package-click="handleToClassPackagePage"></org-package-cell-by-time>
        </el-col>
      </el-row>
    </template>
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
      selectedClassId: '',
      isLoading: true
    }
  },
  async created() {
    try {
      await this.getOrgClasses()
      await this.getOrgClassPackagesById({ classId: this.firstOrgClassId })
      this.selectedClassId = this.firstOrgClassId
    } catch (error) {
      console.error(error)
    }
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/teacher/getOrgClasses',
      getOrgClassPackagesById: 'org/teacher/getOrgClassPackagesById'
    }),
    async handleSwitchClass(classId) {
      await this.getOrgClassPackagesById({ classId })
      this.selectedClassId = classId
    },
    handleToClassPackagePage(packageId) {
      this.$router.push({
        name: 'OrgTeacherClassPackage',
        params: { classId: this.selectedClassId, packageId: packageId }
      })
    }
  },
  computed: {
    ...mapGetters({
      orgClasses: 'org/teacher/orgClasses',
      orgClassPackages: 'org/teacher/orgClassPackages'
    }),
    firstOrgClassId() {
      return _.get(this.orgClasses, '[0].id', '')
    },
    selectedClassPackagesCount() {
      return _.get(this.selectedClassPackges, 'length', 0)
    },
    selectedClassPackges() {
      const packags = _.get(this.orgClassPackages, [this.selectedClassId], [])
      return _.map(packags, item => {
        const { organizationId, classId, lastTeachTime, lessons } = item
        return {
          ...item.package,
          lessons,
          organizationId,
          classId,
          lastTeachTime
        }
      })
    },
    selectedClassPackgesSort() {
      const hasTime = this.selectedClassPackges.filter(item => item.lastTeachTime).sort((a, b) =>  a.lastTeachTime < b.lastTeachTime ? 1 : -1)
      const noTime = this.selectedClassPackges.filter(item => !item.lastTeachTime)
      return [...hasTime, ...noTime]
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

