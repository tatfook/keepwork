<template>
  <div class="package-detail-page">
    <PackageDetail :packageDetail='packageDetail'></PackageDetail>
    <PackageCatalogue class="package-detail-page-catalogue" :packageDetail='packageDetail'></PackageCatalogue>
  </div>
</template>
<script>
import PackageDetail from './common/PackageDetail'
import PackageCatalogue from './common/PackageCatalogue'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PackageDetailPage',
  async mounted() {
    await this.getPackageDetail({
      packageId: this.packageId
    })
    this.packageDetail = this.studentPackageDetail({
      packageId: this.packageId
    })
  },
  computed: {
    ...mapGetters({
      studentPackageDetail: 'lesson/student/studentPackageDetail'
    })
  },
  data() {
    return {
      packageId: '10',
      packageDetail: {}
    }
  },
  methods: {
    ...mapActions({
      getPackageDetail: 'lesson/student/getPackageDetail'
    })
  },
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
