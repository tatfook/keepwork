<template>
  <div class="package-detail-page">
    <PackageDetail></PackageDetail>
    <PackageCatalogue class="package-detail-page-catalogue"></PackageCatalogue>
  </div>
</template>
<script>
import PackageDetail from './PackageDetail'
import PackageCatalogue from './PackageCatalogue'
export default {
  name: 'PackageDetailPage',
  components: {
    PackageDetail,
    PackageCatalogue
  }
}
</script>
<style lang="scss" scoped>
.package-detail-page {
  &-catalogue {
    margin-top: 40px;
  }
}
</style>
