<template>
  <div class="org-student-class-package" v-if="!isLoading">
    <div class="org-breadcrumb">
      <div class="org-breadcrumb-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'OrgPackages'}">课程包</el-breadcrumb-item>
          <el-breadcrumb-item>
            <el-dropdown @command="handleSelectPackage">
              <span class="el-dropdown-link">
                {{currentPackageName}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in currentClassPackages" :command="item.packageId" :key="item.packageId">{{item.packageName}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <org-package-detail actorType="admin" :packageDetail="packageDetail"></org-package-detail>
  </div>
</template>


<script>
import OrgPackageDetail from '../common/OrgPackageDetail'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'PackageDetail',
  components: {
    OrgPackageDetail
  },
  data() {
    return {
      isLoading: true,
      packageId: ''
    }
  },
  async created() {
    try {
      await this.getPackageDetail()
    } catch (error) {
      console.error(error)
    }
    this.isLoading = false
  },
  watch: {
    async $route(route) {
      await this.getPackageDetail()
    }
  },
  destroyed() {
    window.document.title = 'Keepwork'
  },
  methods: {
    ...mapActions({
      getOrgPackageDetail: 'org/getOrgPackageDetail',
      getOrgPackages: 'org/getOrgPackages'
    }),
    handleSelectPackage(packageId) {
      const { name, params } = this.$route
      this.$router.push({ name, params: { ...params, packageId } })
    },
    async getPackageDetail() {
      const { packageId, orgLoginUrl } = this.$route.params
      this.packageId = _.toNumber(packageId)
      await Promise.all([
        this.getOrgPackageDetail({
          packageId: this.packageId
        }),
        this.getOrgPackages({ classId: this.classId })
      ])
      window.document.title = this.currentPackageName
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      orgPackagesDetail: 'org/orgPackagesDetail',
      getOrgPackagesById: 'org/getOrgPackagesById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgPackages() {
      return this.getOrgPackagesById({ id: this.orgId })
    },
    currentClassPackages() {
      return _.map(this.orgPackages, item => ({
        ...item,
        ...item.package
      }))
    },
    currentPackageDetail() {
      return _.get(this.orgPackagesDetail, [this.packageId], {})
    },
    currentPackageName() {
      return _.get(this.packageDetail, 'packageName', '')
    },
    packageDetail() {
      return {
        ...this.currentPackageDetail,
        ...this.currentPackageDetail.package
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.org-student-class-package {
  .org-breadcrumb {
    background: #fff;
    color: #999;
    border-bottom: solid 1px #e6e6e6;
    &-main {
      max-width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      padding-left: 20px;
      .el-breadcrumb {
        height: 58px;
        line-height: 58px;
      }
      .el-dropdown-link {
        cursor: pointer;
      }
    }
  }
}
</style>
