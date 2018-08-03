<template>
  <PackageDetail :actorType='actorType' :packageId='packageId'></PackageDetail>
</template>
<script>
import PackageDetail from '../common/PackageDetail'
export default {
  name: 'PackageDetailPage',
  data() {
    return {
      actorType: 'teacher',
      packageId: this.$route.params.id
    }
  },
  components: {
    PackageDetail
  }
}
</script>
