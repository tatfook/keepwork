<template>
  <div class="org-study-package" v-if="!isLoading">
    <div class="org-study-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Lesson' }">课程</el-breadcrumb-item>
        <el-breadcrumb-item>{{currentPackageName}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <org-package-detail actorType="admin" :packageDetail="packageDetail"></org-package-detail>
  </div>
</template>


<script>
import OrgPackageDetail from './common/OrgPackageDetail'
import { lesson } from '@/api'
import _ from 'lodash'
export default {
  name: 'PackageDetail',
  components: {
    OrgPackageDetail
  },
  data() {
    return {
      isLoading: true,
      packageId: '',
      packageDetail: {}
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
    async getPackageDetail() {
      const { packageId, orgLoginUrl } = this.$route.params
      this.packageId = _.toNumber(packageId)
      this.packageDetail = await lesson.packages.packageDetail({ packageId })
      window.document.title = this.currentPackageName
    }
  },
  computed: {
    currentPackageName() {
      return _.get(this.packageDetail, 'packageName', '')
    }
  }
}
</script>


<style lang="scss" scoped>
.org-study-package {
  .org-study-breadcrumb {
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
  }
}
</style>
