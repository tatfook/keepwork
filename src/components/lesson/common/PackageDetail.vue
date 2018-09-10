<template>
  <div class="package-detail-page" v-loading="isLoading">
    <package-basic-detail :packageDetail='packageDetail'></package-basic-detail>
    <package-catalogue class="package-detail-page-catalogue" :packageDetail='packageDetail' :actorType='actorType'></package-catalogue>
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
    this.isLoading = false
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
      isLoading: true,
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
  max-width: 1150px;
  margin: 0 auto;
  padding-top: 30px;
  &-catalogue {
    margin-top: 40px;
  }
}
</style>
