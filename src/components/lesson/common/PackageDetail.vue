<template>
  <div class="package-detail-page">
    <p>{{actorType}}</p>
    <PackageBasicDetail :packageDetail='packageDetail'></PackageBasicDetail>
    <PackageCatalogue class="package-detail-page-catalogue" :packageDetail='packageDetail'></PackageCatalogue>
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
    this.packageDetail = this.studentPackageDetail({
      packageId: this.packageId
    })
  },
  props: {
    actorType: String
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
