
<template>
  <div class="package-detail-page" v-if="!isLoading">
    <package-basic-detail :packageDetail='packageDetail' :actorType='actorType' :isPreview="true"></package-basic-detail>
    <package-catalogue class="package-detail-page-catalogue" :packageDetail='packageDetail' :actorType='actorType' :isPreview="true"></package-catalogue>
  </div>
</template>

<script>
import PackageBasicDetail from '@/components/lesson/common/PackageBasicDetail'
import PackageCatalogue from '@/components/lesson/common/PackageCatalogue'
import axios from 'axios'
export default {
  name: 'PackagePreview',
  components: {
    PackageBasicDetail,
    PackageCatalogue
  },
  data() {
    return {
      isLoading: true,
      actorType: 'teacher',
      packageDetail: {}
    }
  },
  async created() {
    const { packageId = '' } = this.$route.params
    if (!packageId) {
      return this.$router.push('/')
    }
    const instance = axios.create({
      baseURL: process.env.LESSON_API_PREFIX,
      timeout: 20000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
    try {
      const res = await instance.get(`packages/${packageId}/detail`)
      this.packageDetail = res.data
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
      console.error(error)
    }
  }
}
</script>

<style lang="scss" scoped>
.package-detail-page {
  max-width: 1150px;
  margin: 0 auto;
  padding-top: 30px;
  &-catalogue {
    margin-top: 40px;
  }
}
</style>