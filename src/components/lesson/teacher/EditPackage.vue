<template>
  <div class="edit-package" v-loading='isLoading'>
    <PackageEditorHeader :activeTab='activeTab' @changeActiveType='setActiveTab'></PackageEditorHeader>
    <PackageBasicInfo ref="basicInfoComponent" v-if="!isLoading" v-show="activeTab === 'basic'" :isEditing='true' :editingPackageDetail='editingPackageDetail'></PackageBasicInfo>
    <CoverMediaSetter ref="coverUrlComponent" v-if="!isLoading" v-show="activeTab === 'basic'" :isEditing='true' :editingPackageDetail='editingPackageDetail' class="edit-package-media-setter"></CoverMediaSetter>
    <CatalogueManager ref="lessonListComponent" v-if="!isLoading" v-show="activeTab === 'catalogue'" :editingPackageDetail='editingPackageDetail' :isEditing='true'></CatalogueManager>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import PackageEditorHeader from './PackageEditorHeader'
import PackageBasicInfo from './PackageBasicInfo'
import CoverMediaSetter from './CoverMediaSetter'
import CatalogueManager from './CatalogueManager'
export default {
  name: 'EditPackage',
  async mounted() {
    this.isLoading = true
    await this.getPackageDetail({ packageId: this.editingPackageId })
    this.editingPackageDetail = this.lessonPackageDetail({
      packageId: this.editingPackageId
    })
    this.isLoading = false
  },
  data() {
    return {
      editingPackageId: _.get(this.$route.params, 'id'),
      isLoading: true,
      editingPackageDetail: {},
      activeTab: 'basic' //basic or catalogue
    }
  },
  computed: {
    ...mapGetters({
      lessonPackageDetail: 'lesson/packageDetail'
    })
  },
  methods: {
    ...mapActions({
      getPackageDetail: 'lesson/getPackageDetail'
    }),
    setActiveTab(type) {
      this.activeTab = type
    }
  },
  components: {
    PackageEditorHeader,
    PackageBasicInfo,
    CatalogueManager,
    CoverMediaSetter
  }
}
</script>
