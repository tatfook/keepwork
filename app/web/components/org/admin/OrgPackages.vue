<template>
  <div class="org-packages">
    <div class="org-packages-header">
      <div class="org-packages-header-count">
        <span class="org-packages-header-label">{{$t('org.includes')}} </span> {{orgPackages.length}}{{$t('org.packagesCount')}}
      </div>
      <a href="#" class="org-packages-header-link">{{$t('org.moreLessons')}}<i class="el-icon-arrow-right"></i></a>
    </div>
    <div class="org-packages-content">
      <div class="org-packages-item" v-for="(lessonPackage,index) in orgPackages" :key="index">
        <org-package-cell :packageData='lessonPackage.package'></org-package-cell>
      </div>
    </div>
  </div>
</template>
<script>
import OrgPackageCell from '../common/OrgPackageCell'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'OrgPackages',
  mounted() {
    this.toGetOrgPackages()
  },
  data() {
    return {
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgPackagesById: 'org/getOrgPackagesById'
    }),
    organizationId() {
      return this.currentOrg.id
    },
    orgPackages() {
      return this.getOrgPackagesById({ id: this.organizationId }) || []
    }
  },
  methods: {
    ...mapActions({
      getOrgPackages: 'org/getOrgPackages'
    }),
    async toGetOrgPackages() {
      this.isLoading = true
      await this.getOrgPackages({ organizationId: this.organizationId }).catch()
      this.isLoading = false
    }
  },
  components: {
    OrgPackageCell
  }
}
</script>
<style lang="scss" scoped>
.org-packages {
  &-header {
    display: flex;
    color: #303133;
    margin-bottom: 24px;
    font-size: 14px;
    &-count {
      flex: 1;
    }
    &-label {
      color: #909399;
    }
    &-link {
      display: none;
      font-size: 14px;
      color: #909399;
      text-decoration: none;
    }
  }
  &-item {
    width: 290px;
    display: inline-block;
    margin: 0 16px 16px 0;
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
