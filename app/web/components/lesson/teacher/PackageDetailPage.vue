<template>
  <div class="teacher-package-detail-page">
    <package-detail :actorType='actorType' :packageId='packageId'></package-detail>
  </div>
</template>
<script>
import PackageDetail from '../common/PackageDetail'
export default {
  name: 'PackageDetailPage',
  data() {
    return {
      actorType: 'teacher'
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
.teacher-package-detail-page {
  background-color: #fbfbfb;
  min-height: 100%;
}
</style>
