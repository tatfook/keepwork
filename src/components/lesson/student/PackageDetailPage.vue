<template>
  <div class="student-package-detail-page">
    <Header></Header>
    <PackageDetail :actorType='actorType' :packageId='packageId'></PackageDetail>
  </div>
</template>
<script>
import Header from '../common/Header'
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
    Header,
    PackageDetail
  }
}
</script>
<style lang="scss" scoped>
.student-package-detail-page {
  background-color: #fbfbfb;
}
</style>
