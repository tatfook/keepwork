<template>
  <div class="org-package-detail">
    <org-package-basic-detail :packageDetail="packageDetail"></org-package-basic-detail>
    <org-package-catalogue :actorType="actorType" :packageDetail="packageDetail" class="org-package-detail-catalogue"></org-package-catalogue>
  </div>
</template>

<script>
import OrgPackageBasicDetail from './OrgPackageBasicDetail'
import OrgPackageCatalogue from './OrgPackageCatalogue'
export default {
  name: 'OrgPackageDetail',
  props: {
    packageDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    actorType: {
      type: String,
      default: 'teacher'
    }
  },
  components: {
    OrgPackageBasicDetail,
    OrgPackageCatalogue
  }
}
</script>

<style lang="scss" scoped>
.org-package-detail {
  max-width: 1150px;
  margin: 0 auto;
  padding-top: 30px;
  &-catalogue {
    margin-top: 40px;
  }
}
</style>
