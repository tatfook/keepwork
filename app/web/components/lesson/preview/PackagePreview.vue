
<template>
  <div class="package-detail-page" v-loading.fullscreen.lock="isLoading" element-loading-text="拼命加载中" element-loading-background="#fff">
    <package-basic-detail :packageDetail='packageDetail' :actorType='actorType' :isPreview="true"></package-basic-detail>
    <package-catalogue class="package-detail-page-catalogue" :packageDetail='packageDetail' :actorType='actorType' :isPreview="true" :previewToken="previewToken"></package-catalogue>
  </div>
</template>

<script>
import PackageBasicDetail from '@/components/org/common/OrgPackageBasicDetail'
import PackageCatalogue from '@/components/org/common/OrgPackageCatalogue'
import { requestWithoutToken } from '@/api/lesson'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'PackagePreview',
  components: {
    PackageBasicDetail,
    PackageCatalogue
  },
  data() {
    return {
      isLoading: true,
      actorType: 'teacher',
      packageDetail: {},
      previewToken: ''
    }
  },
  async created() {
    const { packageId = '' } = this.$route.params
    const { token = '' } = this.$route.query
    if (token) {
      this.previewToken = token
      this.setPreviewFlag({
        timeStamp: Date.now(),
        token: token
      })
    } else {
      const { timeStamp = '', token = '' } = this.previewFlag
      const timeDiff = Date.now() - timeStamp
      if (token && timeDiff < 20 * 60 * 1000) {
        this.previewToken = token
      } else {
        this.setPreviewFlag({})
      }
    }
    if (!packageId) {
      return this.$router.push('/')
    }
    try {
      const { href } = this.$router.resolve({ path: this.$route.path })
      history.replaceState('', '', href)
      const { data } = await requestWithoutToken.get(
        `packages/${packageId}/detail`
      )

      this.packageDetail = { ...data.data, packageId: data.id }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    ...mapActions({
      setPreviewFlag: 'lesson/setPreviewFlag'
    })
  },
  computed: {
    ...mapGetters({
      previewFlag: 'lesson/previewFlag'
    })
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