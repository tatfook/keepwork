<template>
  <div class="guid-content">
    <SkyDriveManager v-if='showSkyDriveManager'/>
    <h1>{{ $t('common.welcomeToKeepwork') }}</h1>
    <div>
      <el-button type='primary' @click="openNewWebsiteDialog">{{ $t('common.createNewWebsite') }}</el-button>
    </div>
    <NewWebsiteDialog :show='isNewWebsiteDialogShow' @close='closeNewWebsiteDialog'/>
  </div>
</template>

<script>
import NewWebsiteDialog from '@/components/common/NewWebsiteDialog'
import SkyDriveManager from '@/components/common/SkyDriveManager'

export default {
  name: 'EditorWelcome',
  data() {
    return {
      isNewWebsiteDialogShow: false,
      showSkyDriveManager: process.env.HOST_ENV === 'localhost'
    }
  },
  methods: {
    openNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = true
    },
    closeNewWebsiteDialog() {
      this.isNewWebsiteDialogShow = false
    }
  },
  components: {
    NewWebsiteDialog,
    SkyDriveManager
  }
}
</script>