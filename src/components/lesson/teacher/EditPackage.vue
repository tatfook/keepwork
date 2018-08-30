<template>
  <div class="edit-package">
    <PackageEditorHeader :activeTab='activeTab' @changeActiveType='setActiveTab'></PackageEditorHeader>
    <PackageBasicInfo ref="basicInfoComponent" v-show="activeTab === 'basic'" :isEditing='true'></PackageBasicInfo>
    <CoverMediaSetter ref="coverUrlComponent" v-show="activeTab === 'basic'" :isEditing='true' class="edit-package-media-setter"></CoverMediaSetter>
    <CatalogueManager ref="lessonListComponent" v-show="activeTab === 'catalogue'" :isEditing='true'></CatalogueManager>
  </div>
</template>
<script>
import PackageEditorHeader from './PackageEditorHeader'
import PackageBasicInfo from './PackageBasicInfo'
import CoverMediaSetter from './CoverMediaSetter'
import CatalogueManager from './CatalogueManager'
export default {
  name: 'EditPackage',
  data() {
    return {
      activeTab: 'basic' //basic or catalogue
    }
  },
  methods: {
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
