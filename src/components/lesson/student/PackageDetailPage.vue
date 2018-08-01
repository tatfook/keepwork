<template>
  <PackageDetail :actorType='actorType'></PackageDetail>
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
  components: {
    PackageDetail
  }
}
</script>
