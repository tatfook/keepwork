<template>
  <div class="package-detail-page" v-loading="isLoading">
    <package-basic-detail v-if="!isFirstGetData" :packageDetail='packageDetail' :actorType='actorType'></package-basic-detail>
    <package-catalogue v-if="!isFirstGetData" class="package-detail-page-catalogue" :packageDetail='packageDetail' :actorType='actorType'></package-catalogue>
  </div>
</template>
<script>
import PackageBasicDetail from './PackageBasicDetail'
import PackageCatalogue from './PackageCatalogue'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PackageDetail',
  async mounted() {
    this.isFirstGetData = true
    await this.getPackageDetail({
      packageId: this.packageId
    })
    let { packageName } = this.packageDetail
    if (packageName) {
      window.document.title =packageName
    }
    this.isLoading = false
    this.isFirstGetData = false
  },
  props: {
    actorType: String,
    packageId: String
  },
  computed: {
    ...mapGetters({
      lessonPackageDetail: 'lesson/packageDetail'
    }),
    packageDetail() {
      return this.lessonPackageDetail({
        packageId: this.packageId
      })
    }
  },
  data() {
    return {
      isLoading: true,
      isFirstGetData: true
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
