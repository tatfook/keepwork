<template>
  <div class="package-detail-page">
    <PackageBasicDetail :packageDetail='packageDetail'></PackageBasicDetail>
    <PackageCatalogue class="package-detail-page-catalogue" :packageDetail='packageDetail' :actorType='actorType'></PackageCatalogue>
  </div>
</template>
<script>
import PackageBasicDetail from './PackageBasicDetail'
import PackageCatalogue from './PackageCatalogue'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PackageDetail',
  async mounted() {
    await this.getPackageDetail({
      packageId: this.packageId
    })
    this.packageDetail = this.lessonPackageDetail({
      packageId: this.packageId
    })
  },
  props: {
    actorType: String,
    packageId: String
  },
  computed: {
    ...mapGetters({
      lessonPackageDetail: 'lesson/packageDetail'
    })
  },
  data() {
    return {
      packageDetail: {}
    }
  },
  methods: {
    ...mapActions({
      getPackageDetail: 'lesson/getPackageDetail'
    })
  },
  components: {
    PackageBasicDetail,
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
