<template>
  <div class="student-package-detail-page">
    <PackageDetail :actorType='actorType' :packageId='packageId'></PackageDetail>
  </div>
</template>
<script>
import PackageDetail from '../common/PackageDetail'
export default {
  name: 'PackageDetailPage',
  data() {
    return {
      actorType: 'student'
    }
  },
  computed: {
    packageId() {
      return this.$route.params.id
    }
  },
  components: {
    PackageDetail
  }
}
</script>
<style lang="scss" scoped>
.student-package-detail-page {
  background-color: #fbfbfb;
}
</style>
