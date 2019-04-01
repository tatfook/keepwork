<template>
  <div class="org-teahcer-class-package" v-if="!isLoading">
    <div class="org-breadcrumb">
      <div class="org-breadcrumb-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'OrgTeacher' }">{{$t("org.TeachLabel")}}</el-breadcrumb-item>
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
    <org-package-detail :actorType="actorType" :packageDetail="packageDetail"></org-package-detail>
  </div>
</template>

<script>
import OrgPackageDetail from '../common/OrgPackageDetail'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'

export default {
  name: 'OrgTeacherClassPackage',
  components: {
    OrgPackageDetail
  },
  data() {
    return {
      isLoading: true,
      classId: '',
      packageId: ''
    }
  },
  async created() {
    try {
      await this.gettPackageDetail()
    } catch (error) {
      console.error(error)
    }
    this.isLoading = false
  },
  watch: {
    async $route(route) {
      await this.gettPackageDetail()
    }
  },
  methods: {
    ...mapActions({
      getOrgClassPackageDetail: 'org/teacher/getOrgClassPackageDetail',
      getOrgClassPackagesById: 'org/teacher/getOrgClassPackagesById'
    }),
    handleSelectPackage(packageId) {
      const { name, params } = this.$route
      this.$router.push({ name, params: { ...params, packageId } })
    },
    async gettPackageDetail() {
      const { classId, packageId, orgLoginUrl } = this.$route.params
      this.classId = _.toNumber(classId)
      this.packageId = _.toNumber(packageId)
      await Promise.all([
        this.getOrgClassPackageDetail({
          classId: this.classId,
          packageId: this.packageId
        }),
        this.getOrgClassPackagesById({ classId: this.classId })
      ])
    }
  },
  computed: {
    ...mapGetters({
      orgClassPackagesDetail: 'org/teacher/orgClassPackagesDetail',
      orgClassPackages: 'org/teacher/orgClassPackages'
    }),
    currentClassPackages() {
      return _.map(_.get(this.orgClassPackages, [this.classId], []), item => ({
        ...item,
        ...item.package
      }))
    },
    currentPackageDetail() {
      return _.get(
        this.orgClassPackagesDetail,
        [this.classId, this.packageId],
        {}
      )
    },
    currentPackageName() {
      return _.get(this.packageDetail, 'packageName', '')
    },
    packageDetail() {
      return {
        ...this.currentPackageDetail,
        ...this.currentPackageDetail.package
      }
    },
    actorType() {
      return 'teacher'
    }
  }
}
</script>

<style lang="scss" scoped>
.org-teahcer-class-package {
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

